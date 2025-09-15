## Fast Buffer Allocation

Buffers can be created in two main ways:

### 1. `Buffer.alloc(size, fill?)`

- **Safe** method.
- Allocates memory and **initializes it with zeros** (or the given `fill` value).
- Guarantees no “dirty” data from old memory chunks.
- Slower, because the memory needs to be cleared before use.

```js
const buff = Buffer.alloc(10000, 0); // 10 KB zero-filled buffer
```

---

### 2. `Buffer.allocUnsafe(size)`

- **Fastest** method.
- Allocates memory **without initialization**.
- Memory may contain **leftover data** (garbage values) from previous usage.
- Safer only if you immediately overwrite the contents.
- Useful when speed is critical and data security doesn’t matter.

```js
const unsafeBuffer = Buffer.allocUnsafe(10000);

for (let i = 0; i < unsafeBuffer.length; i++) {
  if (unsafeBuffer[i] !== 0) {
    console.log(`Element ${i} had old data: ${unsafeBuffer[i].toString(2)}`);
  }
}
```

---

### 3. Behind the Scenes

- Both `Buffer.from()` and `Buffer.concat()` internally use **`Buffer.allocUnsafe`** for performance.
- They rely on Node’s internal logic to immediately overwrite the memory with new content, making it safe in practice.

```js
Buffer.from([1, 2, 3]); // Uses allocUnsafe internally
Buffer.concat([buf1, buf2]); // Same
```

---

### 4. Memory Pooling (`Buffer.poolSize`)

- When a Node.js app starts, it **pre-allocates 8 KiB** of memory.
- This is a shared **Buffer pool** from which small Buffers are sliced.
- Using `Buffer.allocUnsafe(size)` pulls memory from this pool.
- If the requested size is larger than the pool, a new memory region is allocated.

```js
console.log(Buffer.poolSize); // Default: 8192 bytes = 8 KiB
```

---

### 5. `Buffer.allocUnsafeSlow(size)`

- Skips the **shared pool mechanism** and allocates a standalone memory block.
- Slower than `allocUnsafe`, but avoids sharing from the pool.
- Rarely needed—useful for very large Buffers where you don’t want them eating into the pool space.

```js
const slowBuffer = Buffer.allocUnsafeSlow(10000);
```

---

⚡ **Summary**:

- `Buffer.alloc` → safe, slower (zero-filled).
- `Buffer.allocUnsafe` → unsafe, fastest, uses pool (good if you overwrite immediately).
- `Buffer.allocUnsafeSlow` → no pooling, slower, rarely needed.
- Pooling (`Buffer.poolSize = 8 KiB`) makes small allocations fast and efficient.

---
