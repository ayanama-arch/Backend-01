# File System in Node.js

```js
const fs = require("fs");

const content = fs.readFileSync("./text.txt");
console.log(content.toString("utf8"));
```

## What is a File?

A **file** is essentially a collection of binary data (0s and 1s). The way this data is interpreted depends on the **encoding** (for example, UTF-8 for text).

Along with the actual content, each file also has **metadata**, which stores information such as:

- File name
- Size
- Creation and modification times
- Permissions

## How Node.js Handles Files

- Node.js does not directly interact with the hard drive. Instead, it makes a **system call** to the operating system.
- The operating system then accesses the storage (e.g., hard drive, SSD) and retrieves the file’s data.
- Node.js uses **libuv**, a C library, to handle these low-level system calls and abstract away OS-level differences.

This means Node.js acts as a middleman:
**Your code → Node.js (libuv) → OS system calls → File system (hard drive).**

---

## File System APIs in Node.js

Node.js provides **three different styles of APIs** for performing file system operations:

1. **Promise-based API (`fs/promises`)**
2. **Callback-based API (`fs`)**
3. **Synchronous API (`fs`)**

---

### 1. Promise-based API

- Modern and preferred way for most cases.
- Works seamlessly with `async/await`.
- Cleaner, avoids “callback hell.”

**Example: Reading a file (Promise API)**

```js
// fs/promises gives promise-based methods
const fs = require("fs/promises");

async function readFile() {
  try {
    const data = await fs.readFile("./text.txt", "utf8");
    console.log("File content:", data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

readFile();
```

---

### 2. Callback-based API

- Old-school Node.js style, still widely used.
- Functions take a callback as the last argument (`(err, data) => {}`).
- Can be slightly faster than Promises in performance-critical paths, since there’s no Promise overhead.

**Example: Reading a file (Callback API)**

```js
const fs = require("fs");

fs.readFile("./text.txt", "utf8", (err, data) => {
  if (err) {
    return console.error("Error reading file:", err);
  }
  console.log("File content:", data);
});
```

---

### 3. Synchronous API

- Executes file operations **blocking the event loop** until the operation is finished.
- Should **only be used when blocking is acceptable**, e.g., small scripts, startup configuration, or command-line tools.
- Never use in production servers handling concurrent requests—it will freeze everything until the operation completes.

**Example: Reading a file (Sync API)**

```js
const fs = require("fs");

try {
  const data = fs.readFileSync("./text.txt", "utf8");
  console.log("File content:", data);
} catch (err) {
  console.error("Error reading file:", err);
}
```

---

### When to Use What?

- **Promise API** → Default choice for modern apps; clean + async/await support.
- **Callback API** → When working with old codebases or extremely performance-sensitive code.
- **Synchronous API** → Only for scripts, config loading at startup, or cases where blocking is acceptable.

---

So the hierarchy in real-world dev is basically:
👉 **Use Promise API** → 99% of the time.
👉 **Use Callbacks** → Legacy code or extreme performance tuning.
👉 **Use Sync** → Only when you _know_ blocking is harmless.

---

### Callback vs Promise – What’s happening under the hood?

1. **Callbacks**

   - A callback is just a **function reference** passed into another function.
   - When the async operation is done, Node.js executes that function.
   - It’s direct, like saying: _“When you’re finished, call this number.”_

   Example mental model:

   ```js
   setTimeout(() => console.log("done"), 0);
   ```

   The function is placed in the event loop queue → when ready → executed. That’s it.

2. **Promises**

   - A Promise wraps callbacks in extra machinery.
   - Every `then()` or `await` creates an additional **microtask** in the event loop.
   - This means more objects are created (Promise instances, closures, handlers).
   - `await` makes code look synchronous, but under the hood, Node schedules microtasks to handle resolution/rejection.

   Example mental model:

   ```js
   Promise.resolve().then(() => console.log("done"));
   ```

   Here, a microtask queue is involved, not just the callback queue.

---

### Why callbacks are _faster_ (in raw performance)

- Less overhead: No need to create and resolve/reject Promise objects.
- No microtask scheduling: Promises always schedule callbacks in the **microtask queue**, while raw callbacks just hit the **task queue** directly.
- Fewer allocations: Callbacks are just functions; Promises wrap functions inside objects and chainable structures.

So technically, **callbacks execute with fewer steps → slightly faster.**

---

### But here’s the twist

The performance difference is tiny in real-world applications. Unless you’re writing a **high-performance library or benchmark code**, you won’t feel it. For app development:

- **Promises (with async/await)** give you cleaner, maintainable code.
- **Callbacks** give you raw speed, but can spiral into “callback hell.”

Think of it like this:
Callbacks = manual gears (faster if you’re a pro driver).
Promises = automatic transmission (slightly less raw speed, but far more convenient).

---
