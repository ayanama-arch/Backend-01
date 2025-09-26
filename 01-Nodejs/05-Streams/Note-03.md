# Complete Guide to Node.js Writable Streams

## Table of Contents

1. [What are Writable Streams?](#what-are-writable-streams)
2. [Performance Comparison Example](#performance-comparison-example)
3. [Core Concepts](#core-concepts)
4. [Creating Writable Streams](#creating-writable-streams)
5. [Stream Properties and Methods](#stream-properties-and-methods)
6. [Events and Event Handling](#events-and-event-handling)
7. [Backpressure Management](#backpressure-management)
8. [Stream States and Lifecycle](#stream-states-and-lifecycle)
9. [Error Handling](#error-handling)
10. [Practical Examples](#practical-examples)
11. [Best Practices](#best-practices)
12. [Common Patterns](#common-patterns)

## What are Writable Streams?

Writable streams are Node.js objects that allow you to write data in chunks rather than all at once. They provide:

- **Memory efficiency**: Process large amounts of data without loading everything into memory
- **Backpressure handling**: Automatic flow control to prevent overwhelming the destination
- **Event-driven architecture**: Non-blocking operations with event-based notifications
- **Flexibility**: Can write to files, HTTP responses, databases, or custom destinations

### Common Use Cases

- Writing to files
- HTTP response streams
- Database bulk inserts
- Compression/transformation pipelines
- Custom data processing

## Performance Comparison Example

From your learning code, here's how different approaches compare:

| Method               | Execution Time | Memory Usage | Key Characteristics            |
| -------------------- | -------------- | ------------ | ------------------------------ |
| Async/await writes   | 8s             | 50MB         | Slow due to individual awaits  |
| Synchronous writes   | 1.8s           | 50MB         | Faster but blocks event loop   |
| Naive streaming      | 270ms          | 200MB        | Fast but high memory usage     |
| **Proper streaming** | **300ms**      | **50MB**     | **Optimal: Fast + low memory** |

### Method 1: Individual Async Writes (❌ Poor Performance)

```javascript
// 8 seconds, 50MB memory
for (let i = 0; i < 1000000; i++) {
  await fileHandle.write(` ${i} `);
}
```

### Method 4: Proper Streaming (✅ Optimal)

```javascript
const writeMany = () => {
  while (i < numberOfWrites) {
    const buff = Buffer.from(` ${i} `, "utf-8");

    if (i === numberOfWrites - 1) {
      return stream.end(buff);
    }

    if (!stream.write(buff)) break; // Respect backpressure
    i++;
  }
};

writeMany();
stream.on("drain", writeMany); // Resume when buffer drains
```

## Core Concepts

### 1. **Chunks**

Data is written in discrete pieces called chunks:

```javascript
stream.write("Hello "); // Chunk 1
stream.write("World!"); // Chunk 2
stream.end(); // Signal completion
```

### 2. **Internal Buffer**

Streams maintain an internal buffer with configurable size:

```javascript
const stream = new WritableStream({
  highWaterMark: 16384, // 16KB buffer (default)
});
```

### 3. **Backpressure**

When the buffer fills up, the stream signals to slow down:

```javascript
const success = stream.write(data);
if (!success) {
  // Buffer is full, wait for 'drain' event
  stream.once("drain", () => {
    // Safe to write more
  });
}
```

## Creating Writable Streams

### 1. **File Streams**

```javascript
const fs = require("fs");

// Simple file stream
const fileStream = fs.createWriteStream("output.txt");

// With options
const fileStreamWithOptions = fs.createWriteStream("output.txt", {
  flags: "a", // append mode
  encoding: "utf8", // text encoding
  highWaterMark: 64 * 1024, // 64KB buffer
});
```

### 2. **HTTP Response Streams**

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  // res is a writable stream
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello ");
  res.write("World!");
  res.end();
});
```

### 3. **Custom Writable Streams**

```javascript
const { Writable } = require("stream");

class MyWritableStream extends Writable {
  constructor(options) {
    super(options);
    this.data = [];
  }

  _write(chunk, encoding, callback) {
    // Process the chunk
    this.data.push(chunk.toString());

    // Simulate async operation
    setTimeout(() => {
      console.log(`Processed: ${chunk.toString()}`);
      callback(); // Signal completion
    }, 100);
  }

  _final(callback) {
    // Called when stream.end() is called
    console.log("Stream finished");
    callback();
  }
}
```

### 4. **Transform Streams** (Writable + Readable)

```javascript
const { Transform } = require("stream");

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}
```

## Stream Properties and Methods

### Key Properties

```javascript
const stream = fs.createWriteStream("file.txt");

// Buffer information
console.log(stream.writableHighWaterMark); // Buffer size limit (16384)
console.log(stream.writableLength); // Current buffer usage
console.log(stream.writableBuffer); // Internal buffer array

// State information
console.log(stream.writable); // true if stream accepts writes
console.log(stream.writableEnded); // true if end() was called
console.log(stream.writableFinished); // true if all data processed
console.log(stream.destroyed); // true if stream was destroyed
```

### Essential Methods

#### **write(chunk, encoding, callback)**

```javascript
// Basic write
const success = stream.write("Hello World");

// With encoding
stream.write(buffer, "utf8");

// With callback
stream.write("data", "utf8", (error) => {
  if (error) {
    console.error("Write failed:", error);
  } else {
    console.log("Write successful");
  }
});
```

#### **end(chunk, encoding, callback)**

```javascript
// End without final data
stream.end();

// End with final chunk
stream.end("Final data");

// End with callback
stream.end("Final data", "utf8", () => {
  console.log("Stream closed");
});
```

#### **cork() and uncork()**

```javascript
// Buffer multiple writes
stream.cork();
stream.write("chunk1");
stream.write("chunk2");
stream.write("chunk3");
stream.uncork(); // Flush all at once
```

#### **destroy(error)**

```javascript
// Destroy stream
stream.destroy();

// Destroy with error
stream.destroy(new Error("Something went wrong"));
```

## Events and Event Handling

### Core Events

#### **'drain'** - Buffer Ready for More Data

```javascript
stream.on("drain", () => {
  console.log("Buffer drained, safe to write more");
  // Resume writing operations
});
```

#### **'finish'** - All Data Written

```javascript
stream.on("finish", () => {
  console.log("All data has been written");
  // Stream is finished but not necessarily closed
});
```

#### **'close'** - Stream Completely Closed

```javascript
stream.on("close", () => {
  console.log("Stream closed");
  // All resources released
});
```

#### **'error'** - Error Occurred

```javascript
stream.on("error", (error) => {
  console.error("Stream error:", error);
  // Handle error appropriately
});
```

#### **'pipe'** and **'unpipe'** - Piping Events

```javascript
stream.on("pipe", (src) => {
  console.log("Something is piping into this stream");
});

stream.on("unpipe", (src) => {
  console.log("Something stopped piping into this stream");
});
```

### Event Sequence

```
write() -> drain (if needed) -> finish -> close
```

## Backpressure Management

Backpressure is crucial for preventing memory issues when writing data faster than it can be processed.

### Understanding the Flow

```javascript
const writeWithBackpressure = (stream, data) => {
  return new Promise((resolve, reject) => {
    const write = () => {
      let canContinue = true;

      while (data.length > 0 && canContinue) {
        const chunk = data.shift();

        if (data.length === 0) {
          // Last chunk
          stream.end(chunk, resolve);
          return;
        }

        canContinue = stream.write(chunk);
      }

      if (!canContinue) {
        // Wait for drain
        stream.once("drain", write);
      } else {
        resolve();
      }
    };

    stream.on("error", reject);
    write();
  });
};
```

### Practical Backpressure Example

```javascript
const fs = require("fs");

const writeLotsOfData = async (filePath, dataArray) => {
  const stream = fs.createWriteStream(filePath);

  const writeChunk = (index) => {
    return new Promise((resolve, reject) => {
      if (index >= dataArray.length) {
        stream.end(resolve);
        return;
      }

      const success = stream.write(dataArray[index]);

      if (success) {
        // Can continue immediately
        setImmediate(() => writeChunk(index + 1).then(resolve, reject));
      } else {
        // Must wait for drain
        stream.once("drain", () => {
          writeChunk(index + 1).then(resolve, reject);
        });
      }

      stream.on("error", reject);
    });
  };

  return writeChunk(0);
};
```

## Stream States and Lifecycle

### Stream States

```javascript
const checkStreamState = (stream) => {
  console.log({
    writable: stream.writable, // Can accept writes
    writableEnded: stream.writableEnded, // end() was called
    writableFinished: stream.writableFinished, // All data processed
    writableCorked: stream.writableCorked, // Number of cork() calls
    destroyed: stream.destroyed, // Stream destroyed
  });
};
```

### Lifecycle Events

```javascript
const stream = fs.createWriteStream("output.txt");

stream.on("open", () => {
  console.log("Stream opened");
});

stream.on("ready", () => {
  console.log("Stream ready for writing");
});

stream.on("finish", () => {
  console.log("Stream finished writing");
});

stream.on("close", () => {
  console.log("Stream closed");
});
```

## Error Handling

### Comprehensive Error Handling

```javascript
const createResilientStream = (filePath) => {
  const stream = fs.createWriteStream(filePath);

  // Handle various error scenarios
  stream.on("error", (error) => {
    console.error("Stream error:", error.code, error.message);

    switch (error.code) {
      case "ENOENT":
        console.error("File or directory not found");
        break;
      case "EACCES":
        console.error("Permission denied");
        break;
      case "EMFILE":
        console.error("Too many open files");
        break;
      default:
        console.error("Unknown error occurred");
    }
  });

  return stream;
};
```

### Graceful Cleanup

```javascript
const writeWithCleanup = async (filePath, data) => {
  let stream;

  try {
    stream = fs.createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);

      data.forEach((chunk) => stream.write(chunk));
      stream.end();
    });
  } catch (error) {
    console.error("Write failed:", error);
    throw error;
  } finally {
    if (stream && !stream.destroyed) {
      stream.destroy();
    }
  }
};
```

## Practical Examples

### 1. **CSV Writer Stream**

```javascript
class CSVWriter extends Writable {
  constructor(filePath, headers) {
    super({ objectMode: true });
    this.fileStream = fs.createWriteStream(filePath);
    this.isFirstRow = true;
    this.headers = headers;
  }

  _write(record, encoding, callback) {
    if (this.isFirstRow && this.headers) {
      this.fileStream.write(this.headers.join(",") + "\n");
      this.isFirstRow = false;
    }

    const csvRow = Object.values(record).join(",") + "\n";

    if (this.fileStream.write(csvRow)) {
      callback();
    } else {
      this.fileStream.once("drain", callback);
    }
  }

  _final(callback) {
    this.fileStream.end(callback);
  }
}

// Usage
const csvWriter = new CSVWriter("output.csv", ["name", "age", "city"]);
csvWriter.write({ name: "John", age: 30, city: "NYC" });
csvWriter.write({ name: "Jane", age: 25, city: "LA" });
csvWriter.end();
```

### 2. **Batched Database Writer**

```javascript
class BatchedDBWriter extends Writable {
  constructor(db, tableName, batchSize = 100) {
    super({ objectMode: true });
    this.db = db;
    this.tableName = tableName;
    this.batchSize = batchSize;
    this.batch = [];
  }

  _write(record, encoding, callback) {
    this.batch.push(record);

    if (this.batch.length >= this.batchSize) {
      this.flushBatch(callback);
    } else {
      callback();
    }
  }

  async flushBatch(callback) {
    if (this.batch.length === 0) {
      return callback();
    }

    try {
      await this.db.insertMany(this.tableName, this.batch);
      this.batch = [];
      callback();
    } catch (error) {
      callback(error);
    }
  }

  _final(callback) {
    this.flushBatch(callback);
  }
}
```

### 3. **Compression Stream**

```javascript
const zlib = require("zlib");

const compressFile = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const readable = fs.createReadStream(inputPath);
    const writable = fs.createWriteStream(outputPath);
    const gzip = zlib.createGzip();

    readable
      .pipe(gzip)
      .pipe(writable)
      .on("finish", resolve)
      .on("error", reject);
  });
};
```

## Best Practices

### 1. **Always Handle Backpressure**

```javascript
// Good
const writeData = (stream, data) => {
  if (!stream.write(data)) {
    stream.once("drain", () => {
      // Continue writing
    });
  }
};

// Bad
const writeDataBad = (stream, data) => {
  stream.write(data); // Ignores return value
};
```

### 2. **Proper Error Handling**

```javascript
stream.on("error", (error) => {
  console.error("Stream error:", error);
  // Always handle errors to prevent crashes
});
```

### 3. **Clean Resource Management**

```javascript
const cleanup = (stream) => {
  if (stream && !stream.destroyed) {
    stream.destroy();
  }
};

process.on("exit", cleanup);
process.on("SIGINT", cleanup);
```

### 4. **Use Appropriate Buffer Sizes**

```javascript
// For large files
const largeFileStream = fs.createWriteStream("large.txt", {
  highWaterMark: 64 * 1024, // 64KB
});

// For small, frequent writes
const smallWriteStream = fs.createWriteStream("small.txt", {
  highWaterMark: 1024, // 1KB
});
```

### 5. **Monitor Stream Health**

```javascript
const monitorStream = (stream) => {
  setInterval(() => {
    console.log({
      bufferSize: stream.writableLength,
      bufferLimit: stream.writableHighWaterMark,
      utilization:
        ((stream.writableLength / stream.writableHighWaterMark) * 100).toFixed(
          2
        ) + "%",
    });
  }, 1000);
};
```

## Common Patterns

### 1. **Promise-Based Stream Writing**

```javascript
const writeToStream = (stream, data) => {
  return new Promise((resolve, reject) => {
    stream.write(data, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
};
```

### 2. **Stream Pipeline Pattern**

```javascript
const { pipeline } = require("stream");
const { promisify } = require("util");
const pipelineAsync = promisify(pipeline);

// Safe pipeline with automatic cleanup
await pipelineAsync(
  fs.createReadStream("input.txt"),
  new TransformStream(),
  fs.createWriteStream("output.txt")
);
```

### 3. **Conditional Writing**

```javascript
class FilteredWriter extends Writable {
  constructor(destination, filterFn) {
    super({ objectMode: true });
    this.destination = destination;
    this.filterFn = filterFn;
  }

  _write(chunk, encoding, callback) {
    if (this.filterFn(chunk)) {
      if (this.destination.write(chunk)) {
        callback();
      } else {
        this.destination.once("drain", callback);
      }
    } else {
      callback(); // Skip this chunk
    }
  }
}
```

Understanding these concepts and patterns will make you proficient with Node.js writable streams, enabling you to build efficient, memory-conscious applications that can handle large amounts of data gracefully.
