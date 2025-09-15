# Buffer

## Introduction

- A **Buffer** is a special container in memory designed to handle **binary data** (raw bytes).
- Buffers are similar to arrays since they are **indexed**, but instead of holding numbers or strings, they store **raw binary values**.
- When a Buffer is created, its elements are initialized with **zeros** by default.
- Each element of a Buffer occupies **exactly 8 bits (1 byte)** of memory. This size is fixed.
- The maximum size of a Buffer depends on the **available system memory**. You cannot create a Buffer larger than what your machine can allocate.

## Buffer in Action

```js
const { Buffer } = require("buffer");

// Create a Buffer of 4 bytes (all initialized to 0)
const memoryContainer = Buffer.alloc(4);

console.log(memoryContainer[0]); // 0

// Assigning value (hexadecimal)
memoryContainer[0] = 0xf4;
console.log(memoryContainer); // <Buffer f4 00 00 00>
console.log(memoryContainer[0]); // 244 (decimal representation)

// Each element can hold values from 0 to 255 (unsigned 8-bit integer).
```

## Writing Negative Numbers

- By default, a Buffer element is treated as **unsigned** (0 to 255).
- But you can write **signed values** using helper methods like `writeInt8` and read them with `readInt8`.

```js
// Writing -34 at index 2
memoryContainer.writeInt8(-34, 2);

console.log(memoryContainer.readInt8(2)); // -34
console.log(memoryContainer.toString("hex"));
// Prints hex representation of the whole buffer
```

## Challenge Example: Writing Binary to Buffer

Let’s encode the binary number `0100 1000 0110 1001 0010 0001`
(which corresponds to ASCII characters `H i !`).

### Method 1: Manual assignment

```js
const memoryBlock = Buffer.alloc(3);
memoryBlock[0] = 0x48; // H
memoryBlock[1] = 0x69; // i
memoryBlock[2] = 0x21; // !
console.log(memoryBlock.toString("utf-8")); // "Hi!"
```

### Method 2: Using `Buffer.from` with array

```js
const buff = Buffer.from([0x48, 0x69, 0x21]);
console.log(buff.toString("utf8")); // "Hi!"
```

### Method 3: Using `Buffer.from` with hex string

```js
const buff2 = Buffer.from("486921", "hex");
console.log(buff2.toString("utf8")); // "Hi!"
```

---

## Allocating Large Buffers

- Buffers can be **very large**, but their maximum size is limited by:

  1. **Node.js constants** (`buffer.constants.MAX_LENGTH`)
  2. **System memory availability**

- For 64-bit systems, `MAX_LENGTH` is usually around **\~4 GB**.

```js
const { Buffer, constants } = require("buffer");

console.log(constants.MAX_LENGTH);
// Prints maximum allowed buffer size (≈ 4GB on 64-bit)
```

- You can allocate large buffers (e.g., 1 GB) and fill them with data:

```js
const bigBuffer = Buffer.alloc(1e9); // 1 GB buffer

setInterval(() => {
  bigBuffer.fill(0x22); // Fills entire buffer with hex 0x22 (34 in decimal, ASCII '"')
}, 5000);
```

⚠️ **Notes on Large Buffers**:

- They can consume huge amounts of **RAM**; allocating carelessly can crash your program or system.
- `fill()` is faster than manually looping because it’s implemented in optimized C++ under the hood.
- Always consider **memory pressure** when using buffers at this scale—GC (garbage collection) does not magically reduce memory use unless you release references.

---
