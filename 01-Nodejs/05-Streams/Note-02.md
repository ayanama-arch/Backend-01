# Node.js Streams Performance Comparison Notes

## Overview

This code demonstrates different approaches to writing large amounts of data to a file, showcasing how streams can dramatically improve performance and memory usage.

## Performance Comparison Summary

| Method               | Execution Time | Memory Usage | Key Characteristics            |
| -------------------- | -------------- | ------------ | ------------------------------ |
| Async/await writes   | 8s             | 50MB         | Slow due to individual awaits  |
| Synchronous writes   | 1.8s           | 50MB         | Faster but blocks event loop   |
| Naive streaming      | 270ms          | 200MB        | Fast but high memory usage     |
| **Proper streaming** | **300ms**      | **50MB**     | **Optimal: Fast + low memory** |

## Method 1: Individual Async Writes (❌ Poor Performance)

```javascript
// 8 seconds, 50MB memory
for (let i = 0; i < 1000000; i++) {
  await fileHandle.write(` ${i} `);
}
```

**Problems:**

- Each write waits for completion before proceeding
- Massive overhead from 1 million individual async operations
- Event loop constantly switching contexts

## Method 2: Synchronous Writes (⚠️ Blocks Event Loop)

```javascript
// 1.8 seconds, 50MB memory
for (let i = 0; i < 1000000; i++) {
  const buff = Buffer.from(` ${i} `, "utf-8");
  fs.writeSync(fd, buff);
}
```

**Issues:**

- Blocks the entire event loop during execution
- No other operations can run
- Not suitable for server applications

## Method 3: Naive Streaming (⚠️ Memory Issues)

```javascript
// 270ms, 200MB memory
for (let i = 0; i < 1000000; i++) {
  const buff = Buffer.from(` ${i} `, "utf-8");
  stream.write(buff); // No backpressure handling!
}
```

**Problems:**

- Ignores stream's internal buffer limits
- Causes memory buildup when writing faster than disk can handle
- High memory usage due to buffering

## Method 4: Proper Streaming with Backpressure (✅ Optimal)

### Key Concepts

#### **Backpressure**

- Mechanism to prevent overwhelming the stream's internal buffer
- `stream.write()` returns `false` when buffer is full
- Must wait for `drain` event before continuing

#### **High Water Mark**

- `stream.writableHighWaterMark`: Buffer size limit (default: 16384 bytes = 16KB)
- When exceeded, `write()` returns `false`

#### **Buffer Management**

- `stream.writableLength`: Current buffer size
- Stream automatically manages flushing to disk

### Implementation Strategy

```javascript
const writeMany = () => {
  while (i < numberOfWrites) {
    const buff = Buffer.from(` ${i} `, "utf-8");

    // Handle last write specially
    if (i === numberOfWrites - 1) {
      return stream.end(buff); // Closes stream after writing
    }

    // Check backpressure
    if (!stream.write(buff)) break; // Stop if buffer is full

    i++;
  }
};
```

### Event-Driven Flow Control

```javascript
// Initial write attempt
writeMany();

// Resume when buffer drains
stream.on("drain", () => {
  writeMany(); // Continue writing
});

// Handle completion
stream.on("finish", () => {
  console.timeEnd("writeMany");
  fileHandle.close();
});
```

## Key Lessons

### 1. **Respect Backpressure**

Always check the return value of `stream.write()` and stop writing when it returns `false`.

### 2. **Use Events for Flow Control**

The `drain` event signals when it's safe to resume writing.

### 3. **Proper Stream Closure**

Use `stream.end()` for the final write to properly close the stream.

### 4. **Memory vs Speed Trade-offs**

Proper streaming achieves both good performance AND memory efficiency.

### 5. **Buffer Understanding**

- Each `stream.write()` adds to internal buffer
- Buffer size is limited by `writableHighWaterMark`
- Node.js handles actual disk I/O asynchronously

## Best Practices

1. **Always handle backpressure** in production code
2. **Use events** (`drain`, `finish`, `error`) for flow control
3. **Close resources properly** with `stream.end()` and `fileHandle.close()`
4. **Monitor buffer state** with `writableLength` during debugging
5. **Test with realistic data sizes** to identify performance bottlenecks

## Why This Matters

Streams are fundamental to Node.js performance, especially for:

- File processing
- HTTP request/response handling
- Database operations
- Real-time data processing

Understanding backpressure prevents memory leaks and ensures consistent performance under load.
