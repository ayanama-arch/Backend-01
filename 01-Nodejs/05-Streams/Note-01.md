# 📘 Writing in Files & Streams in Node.js

## 🔹 Writing in Files

### Different approaches:

1. **Using `fs/promises` with `await write` (slowest)**

   ```js
   const fs = require("node:fs/promises");

   (async () => {
     console.time("writeMany");
     const fileHandle = await fs.open("test.txt", "w");

     for (let i = 0; i < 1000000; i++) {
       await fileHandle.write(` ${i} `); // Await on every write → very slow
     }
     console.timeEnd("writeMany");
   })();
   ```

   - **Execution Time**: \~8s
   - **CPU**: 100% (1 core)
   - **Memory**: \~50MB
   - ❌ Inefficient — waiting after every write blocks performance.

---

2. **Using `fs.writeSync` (faster)**

   ```js
   const fs = require("node:fs");

   (async () => {
     console.time("writeMany");
     fs.open("test.txt", "w", (err, fd) => {
       for (let i = 0; i < 1000000; i++) {
         const buff = Buffer.from(` ${i} `, "utf-8");
         fs.writeSync(fd, buff);
       }
       console.timeEnd("writeMany");
     });
   })();
   ```

   - **Execution Time**: \~1.8s
   - **CPU**: 100% (1 core)
   - **Memory**: \~50MB
   - ✅ Much faster — synchronous low-level buffer writes.

---

3. **Using `createWriteStream` (fastest, but watch memory!)**

   ```js
   const fs = require("node:fs/promises");

   (async () => {
     console.time("writeMany");
     const fileHandle = await fs.open("test.txt", "w");

     const stream = fileHandle.createWriteStream();
     for (let i = 0; i < 1000000; i++) {
       const buff = Buffer.from(` ${i} `, "utf-8");
       stream.write(buff);
     }
     console.timeEnd("writeMany");
   })();
   ```

   - **Execution Time**: \~270ms
   - **CPU**: 100% (1 core)
   - **Memory**: \~200MB (dangerous)
   - ❌ Looks fastest, but memory explodes since writes are dumped into buffer with no backpressure handling.

---

## 🔹 Streams in Node.js

### What is a Stream?

- A **stream** is an abstract interface for data that flows **over time** instead of being processed all at once.
- Useful for working with **large data** (files, network responses) without loading everything into memory.

---

### Types of Streams

1. **Writable Streams**

   - Used for writing data (e.g., file system, HTTP response).
   - Each writable stream has an **internal buffer** (\~16MB by default).
   - Data flows in chunks; when buffer fills up, stream flushes to destination.
   - **Events**:

     - `drain` → buffer is empty, ready for more data
     - `finish` → all data flushed, stream closed

   - **Methods**:

     - `write(chunk)` → write data
     - `end()` → close stream

---

2. **Readable Streams**

   - Used for reading data (e.g., reading a file, HTTP request body).
   - Reads data chunk by chunk into an internal buffer (\~16MB).
   - **Events**:

     - `data` → chunk available
     - `end` → no more data
     - `error` → something broke

   - **Methods**:

     - `pipe()` → connect readable → writable

---

3. **Duplex Streams**

   - Stream that is both **readable** and **writable**.
   - Example: TCP sockets.
   - You can send and receive data simultaneously.

---

4. **Transform Streams**

   - Special type of duplex stream where the output is a **transformed version** of the input.
   - Example:

     - Compressing data with `zlib`
     - Encrypting/decrypting data
     - Converting JSON → CSV

---

## 🔹 Key Insights

- Streams let you handle **huge data** with **constant memory usage**.
- They prevent your process from blowing up (like in the `createWriteStream` case if backpressure is ignored).
- Always handle **backpressure** when writing streams → use `stream.write()` return value + `drain` event.

---
