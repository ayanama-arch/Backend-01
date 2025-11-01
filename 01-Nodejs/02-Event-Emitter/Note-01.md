## ⚙️ 1. First Principles — What is an Event?

An **event** is simply a _signal_ that something has happened.
In programming terms, it’s a message sent by one part of a system that other parts can listen for and react to.

This concept comes from the **Observer Pattern** — one component (“subject”) emits signals, and others (“observers” or “listeners”) respond to them.

---

## 🧠 2. Node.js and Event-Driven Architecture

Node.js is **event-driven by design**.
Instead of blocking the thread waiting for things like I/O, it registers callbacks to be executed when an event (like “file read finished”) occurs.

The engine behind this is **the Event Loop** — and the interface that developers use to manage custom events is the **`EventEmitter` class**.

---

## ⚡ 3. EventEmitter — The Core Class

In Node.js, `EventEmitter` is provided by the built-in **`events` module**.

You import it like this:

```js
const EventEmitter = require("events");
```

Then you can create an instance:

```js
const emitter = new EventEmitter();
```

Every time something happens that you want others to know about, you **emit** an event.
Others can **listen** for it using `.on()`.

---

## 🧩 4. Core Methods of EventEmitter

Let’s go one by one.

### 1️⃣ `.on(eventName, listener)`

Registers a listener (callback function) for an event.

```js
emitter.on("greet", (name) => {
  console.log(`Hello, ${name}!`);
});
```

### 2️⃣ `.emit(eventName, [...args])`

Emits (triggers) an event, optionally passing data.

```js
emitter.emit("greet", "Boss");
```

Output:

```
Hello, Boss!
```

So `.emit()` is the “shout” and `.on()` is the “ear”.

---

### 3️⃣ `.once(eventName, listener)`

Registers a listener that runs **only once**, then removes itself automatically.

```js
emitter.once("launch", () => console.log("Launching only once!"));
emitter.emit("launch"); // runs
emitter.emit("launch"); // ignored
```

---

### 4️⃣ `.removeListener(eventName, listener)` or `.off(eventName, listener)`

Removes a specific listener.

```js
function greet(name) {
  console.log(`Hey ${name}`);
}
emitter.on("hello", greet);
emitter.off("hello", greet); // removes that listener
```

---

### 5️⃣ `.removeAllListeners([eventName])`

Removes all listeners for a specific event (or all events if no name provided).

---

### 6️⃣ `.listenerCount(eventName)`

Returns the number of listeners registered for that event.

---

### 7️⃣ `.eventNames()`

Returns an array of all event names with registered listeners.

---

## 🔬 5. Internal Working (Under the Hood)

The `EventEmitter` internally maintains a **map (object)** that connects event names to arrays of listeners.

Roughly speaking:

```js
{
  "greet": [listener1, listener2],
  "exit": [listener3]
}
```

When you call `.emit('greet', 'Boss')`,
it loops through all functions in `listeners['greet']` and executes them with the arguments you passed.

---

## 🧮 6. Example — Building Your Own Event System

Here’s a realistic example:

```js
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// Listener
myEmitter.on("dataReceived", (data) => {
  console.log("Data:", data);
});

// Trigger event
myEmitter.emit("dataReceived", { id: 1, message: "Hello World" });
```

Output:

```
Data: { id: 1, message: 'Hello World' }
```

---

## ⚙️ 7. Example — EventEmitter in Real Node.js modules

Node.js core modules use EventEmitter everywhere:

- `fs.ReadStream` emits `'data'` and `'end'`
- `http.Server` emits `'request'`, `'connection'`, `'close'`
- `process` itself is an EventEmitter (`process.on('exit', ...)`)

Example:

```js
const fs = require("fs");
const stream = fs.createReadStream("test.txt");

stream.on("data", (chunk) => console.log("Chunk:", chunk));
stream.on("end", () => console.log("File finished reading."));
```

---

## ⚖️ 8. Key Details and Rules

- **Synchronous behavior**:
  `.emit()` calls listeners synchronously in the order they were registered.
  So one slow listener blocks the next — unless you explicitly make it async.

- **Max listeners warning**:
  By default, if you add more than 10 listeners for the same event, Node warns you to prevent memory leaks.
  You can change this via:

  ```js
  emitter.setMaxListeners(20);
  ```

- **Error events**:
  `EventEmitter` treats `'error'` specially.
  If you emit an `'error'` event **without a listener**, Node throws an exception and crashes.

  ```js
  emitter.emit("error", new Error("Something went wrong!"));
  ```

  Always handle `'error'` events.

---

## 🧩 9. Inheritance — Custom EventEmitters

You can extend `EventEmitter` to make your own classes “eventful”:

```js
const EventEmitter = require("events");

class Server extends EventEmitter {
  start() {
    console.log("Server starting...");
    this.emit("started");
  }
}

const server = new Server();
server.on("started", () => console.log("Server is up!"));
server.start();
```

---

## 🧪 10. Example — Combining Async + Events

EventEmitter integrates beautifully with async logic.

```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("download", (url) => {
  console.log("Downloading:", url);
  setTimeout(() => {
    console.log("Download complete.");
    emitter.emit("complete", url);
  }, 2000);
});

emitter.on("complete", (url) => {
  console.log(`Finished handling: ${url}`);
});

emitter.emit("download", "https://example.com/file");
```

---

## 🧭 12. Summary

| Concept            | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| **Module**         | `require('events')`                                                 |
| **Core class**     | `EventEmitter`                                                      |
| **Main methods**   | `.on()`, `.emit()`, `.once()`, `.off()`, `.removeAllListeners()`    |
| **Design pattern** | Observer Pattern                                                    |
| **Used by**        | `http`, `fs`, `net`, `process`, etc.                                |
| **Error handling** | Always listen for `'error'`                                         |
| **Sync nature**    | All listeners run synchronously unless you use async logic manually |

---

In essence, **EventEmitter is the heart of Node’s non-blocking philosophy**.
Instead of linear waiting, the system _reacts_ to signals — everything else flows around those events.
