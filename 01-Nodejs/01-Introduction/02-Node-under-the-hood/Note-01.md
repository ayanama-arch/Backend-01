# Node.js Under the Hood - Complete Guide

## 1. What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side, outside of a web browser.

**Key Components:**

- **V8 Engine**: Google's JavaScript engine (written in C++)
- **libuv**: C library for async I/O operations
- **Node.js Core**: C++ bindings and JavaScript APIs

## 2. Architecture Overview

```
┌─────────────────────────────────────┐
│           JavaScript Code           │
├─────────────────────────────────────┤
│         Node.js Core APIs          │
├─────────────────────────────────────┤
│           Node.js Bindings         │
│            (C++ Layer)             │
├─────────────────────────────────────┤
│    V8 Engine    │      libuv       │
│   (JavaScript   │   (Async I/O,    │
│   Execution)    │   Event Loop)    │
├─────────────────┼──────────────────┤
│                 │   Thread Pool    │
│                 │   File System    │
│                 │   Networking     │
└─────────────────┴──────────────────┘
```

## 3. The V8 JavaScript Engine

### 3.1 What V8 Does

- **Parses** JavaScript code into an Abstract Syntax Tree (AST)
- **Compiles** JavaScript to machine code (Just-In-Time compilation)
- **Executes** the compiled code
- **Manages** memory (garbage collection)

### 3.2 V8 Execution Process

1. **Parsing**: Source code → AST
2. **Ignition Interpreter**: AST → Bytecode
3. **TurboFan Compiler**: Hot code → Optimized machine code
4. **Execution**: Run the compiled code

### 3.3 Memory Management

- **Heap**: Where objects are stored
- **Stack**: Where function calls and local variables are stored
- **Garbage Collection**: Automatic memory cleanup using generational collection

## 4. The Event Loop (Heart of Node.js)

### 4.1 Event Loop Phases

The event loop runs in phases, each with a specific purpose:

```
┌───────────────────────────┐
┌─>│           timers          │  ← setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  ← I/O callbacks deferred to next iteration
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  ← Internal use only
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │  ← setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  ← socket.on('close', ...)
   └───────────────────────────┘
```

### 4.2 Phase Details

**1. Timers Phase**

- Executes callbacks scheduled by `setTimeout()` and `setInterval()`
- Checks if timer thresholds have been reached

**2. Pending Callbacks Phase**

- Executes I/O callbacks deferred to the next loop iteration
- Handles system-related callbacks

**3. Poll Phase** (Most Important)

- Fetches new I/O events
- Executes I/O-related callbacks
- Blocks and waits for new events if no timers are scheduled

**4. Check Phase**

- Executes `setImmediate()` callbacks

**5. Close Callbacks Phase**

- Executes close event callbacks (e.g., `socket.on('close')`)

### 4.3 Process.nextTick() and Promise Microtasks

These have higher priority than event loop phases:

```
Event Loop Iteration:
1. Process all process.nextTick() callbacks
2. Process all Promise microtasks
3. Execute current event loop phase
4. Repeat steps 1-3 between each phase
```

## 5. libuv - The Async I/O Library

### 5.1 What libuv Provides

- **Event Loop**: Cross-platform event loop implementation
- **Thread Pool**: For CPU-intensive operations
- **File System Operations**: Async file I/O
- **Networking**: TCP, UDP, pipes
- **Process Management**: Child processes, signals

### 5.2 Thread Pool Operations

Operations that use the thread pool (default 4 threads):

- File system operations (`fs.readFile`, `fs.writeFile`)
- DNS lookups (`dns.lookup`)
- CPU-intensive crypto operations
- `zlib` compression

```javascript
// This will use thread pool
fs.readFile("file.txt", (err, data) => {
  // Callback executed on main thread when operation completes
});
```

### 5.3 Non-blocking I/O Operations

Operations that don't use thread pool (handled by OS):

- Network operations (HTTP, TCP)
- Timers
- `setImmediate`, `process.nextTick`

## 6. Node.js Startup Process

### 6.1 Step-by-Step Startup

1. **Initialize V8 Engine**

   - Set up JavaScript execution environment
   - Create isolate and context

2. **Initialize libuv**

   - Set up event loop
   - Initialize thread pool
   - Set up platform-specific I/O mechanisms

3. **Load Node.js Core Modules**

   - Load built-in modules (fs, http, etc.)
   - Set up global objects (process, Buffer, etc.)

4. **Execute User Script**

   - Parse and compile user JavaScript
   - Start execution

5. **Enter Event Loop**
   - Begin processing events
   - Keep process alive as long as there are active handles

### 6.2 Bootstrap Sequence

```
node script.js
    ↓
Initialize V8
    ↓
Initialize libuv
    ↓
Setup Node.js environment
    ↓
Load and execute script.js
    ↓
Enter event loop (if there are active handles)
    ↓
Process events until no more work
    ↓
Exit process
```

## 7. Module System Deep Dive

### 7.1 Module Loading Process

1. **Path Resolution**

   - Resolve module path
   - Check module cache first

2. **Module Loading**

   - Read file from disk (if not cached)
   - Wrap in module wrapper function
   - Compile and execute

3. **Module Caching**
   - Store compiled module in cache
   - Return cached version on subsequent requires

### 7.2 Module Wrapper Function

Every module is wrapped in a function:

```javascript
(function (exports, require, module, __filename, __dirname) {
  // Your module code here
});
```

### 7.3 Core Modules vs File Modules

**Core Modules**: Built into Node.js binary

- Loaded from memory
- Higher priority than file modules
- Examples: `fs`, `http`, `crypto`

**File Modules**: Loaded from file system

- Can be JavaScript, JSON, or native modules
- Cached after first load

## 8. Memory Management

### 8.1 V8 Memory Structure

- **New Space**: Where new objects are allocated (fast allocation)
- **Old Space**: Long-lived objects (slower allocation, less frequent GC)
- **Large Object Space**: Objects larger than 1MB
- **Code Space**: Compiled JavaScript code

### 8.2 Garbage Collection Process

1. **Minor GC (Scavenge)**: Cleans new space frequently
2. **Major GC (Mark-Sweep-Compact)**: Cleans old space less frequently
3. **Incremental Marking**: Reduces GC pause times

### 8.3 Memory Leaks Common Causes

- Unclosed event listeners
- Global variables that keep growing
- Closures holding large objects
- Timers that are never cleared

## 9. Async Operations Flow

### 9.1 File System Operation Example

```javascript
fs.readFile("file.txt", (err, data) => {
  console.log("File read complete");
});
console.log("After readFile call");
```

**Flow:**

1. `fs.readFile` called (main thread)
2. Request queued to thread pool
3. "After readFile call" logged immediately
4. Thread pool worker reads file
5. When complete, callback queued to event loop
6. Event loop executes callback on main thread

### 9.2 Network Operation Example

```javascript
http.get("http://example.com", (res) => {
  console.log("Response received");
});
console.log("After HTTP call");
```

**Flow:**

1. `http.get` called (main thread)
2. Request handled by OS (no thread pool)
3. "After HTTP call" logged immediately
4. When response arrives, callback queued to event loop
5. Event loop executes callback

## 10. Performance Considerations

### 10.1 Blocking Operations

Operations that block the event loop:

- Synchronous file operations (`fs.readFileSync`)
- CPU-intensive tasks in main thread
- Long-running synchronous loops

### 10.2 Optimization Strategies

1. **Use Async Operations**: Always prefer async APIs
2. **Worker Threads**: For CPU-intensive tasks
3. **Cluster Module**: Utilize multiple CPU cores
4. **Streaming**: For large data processing
5. **Connection Pooling**: Reuse database connections

### 10.3 Monitoring Tools

- **process.hrtime()**: High-resolution timing
- **process.memoryUsage()**: Memory usage statistics
- **--prof flag**: V8 profiling
- **clinic.js**: Performance analysis tools

## 11. Common Misconceptions

### 11.1 "Node.js is Single-Threaded"

**Reality**: The main event loop is single-threaded, but Node.js uses multiple threads:

- Thread pool for I/O operations
- V8 uses threads for garbage collection
- Additional threads for DNS resolution, crypto

### 11.2 "Everything is Asynchronous"

**Reality**: Only I/O operations are asynchronous by default

- CPU operations run on main thread
- Synchronous APIs are available (but should be avoided)

### 11.3 "Callbacks Always Execute Later"

**Reality**: Some operations might complete synchronously

- Always design for asynchronous behavior
- Use `process.nextTick()` for guaranteed async execution

## 12. Best Practices

### 12.1 Event Loop Health

- Avoid blocking operations in main thread
- Use `setImmediate()` for yielding control
- Monitor event loop lag

### 12.2 Error Handling

- Always handle errors in callbacks
- Use domains or async_hooks for async error tracking
- Implement proper error boundaries

### 12.3 Resource Management

- Close file handles and streams
- Clear timeouts and intervals
- Remove event listeners when done
- Use connection pooling for databases

## 13. Debugging Node.js Internals

### 13.1 Useful Command Line Flags

- `--trace-events-enabled`: Enable trace events
- `--trace-sync-io`: Detect synchronous I/O
- `--prof`: Enable V8 profiler
- `--inspect`: Enable debugging

### 13.2 Environment Variables

- `UV_THREADPOOL_SIZE`: Set thread pool size
- `NODE_ENV`: Set environment mode
- `DEBUG`: Enable debug output for modules
