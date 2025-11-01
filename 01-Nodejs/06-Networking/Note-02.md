## 1. Why TCP exists

At the networking level, the internet is built on the **Internet Protocol (IP)**, which simply delivers packets from one address to another. But IP alone is unreliable:

- Packets may arrive out of order.
- Packets may be duplicated.
- Packets may be lost.
- There’s no guarantee of delivery or timing.

**TCP (Transmission Control Protocol)** was invented to solve these problems. It sits above IP and provides:

1. **Reliability** → Lost packets are retransmitted.
2. **Ordered delivery** → Packets are reassembled in the correct sequence.
3. **Error checking** → Checksums verify data integrity.
4. **Flow control** → Adjusts rate of sending so receiver isn’t overwhelmed.
5. **Connection-orientation** → Uses a handshake to establish communication before sending data.

So, TCP is basically “IP, but trustworthy.”

---

## 2. TCP’s life cycle

A TCP connection goes through stages:

1. **Server listens** on a port (like a “doorbell” waiting).
2. **Client initiates** connection.
3. **Three-way handshake**:

   - Client → SYN → Server
   - Server → SYN-ACK → Client
   - Client → ACK → Server
     After this, the channel is established.

4. **Data transfer**: Segments are sent, acknowledged, and reassembled.
5. **Connection termination**: FIN packets close the channel cleanly.

---

## 3. How Node.js implements TCP

Node gives you the `net` module for raw TCP sockets. Unlike `http`, this doesn’t deal with headers or methods—just raw byte streams.

### Your Server code

```js
const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(data.toString("utf-8"));
  });
});

server.listen(3099, "127.0.0.1", () => {
  console.log("opened server on", server.address());
});
```

- `net.createServer()` → creates a TCP server. Each incoming client connection is represented as a **socket** object.
- `socket.on("data", handler)` → receives incoming data as a stream of raw bytes. You convert it into a string using `.toString("utf-8")`.
- `server.listen(port, host)` → binds the server to a local IP and port. Here, you used `127.0.0.1:3099`.
- When a client connects and sends data, it triggers the `"data"` event.

### Your Client code

```js
const net = require("net");

const socket = net.createConnection({ host: "127.0.0.1", port: 3099 }, () => {
  socket.write("A simple message coming from simple server!!");
});
```

- `net.createConnection()` → opens a TCP connection to the server.
- Once the connection is established, the callback runs.
- `socket.write()` → sends data down the TCP stream to the server.

---

## 4. What actually happened in your demo

1. The **server** starts and waits at port `3099`.
2. The **client** connects via TCP to `127.0.0.1:3099`.
3. The **TCP 3-way handshake** happens under the hood—Node abstracts this, but it’s happening.
4. The client sends `"A simple message coming from simple server!!"`.
5. The server receives it in a TCP segment, emits `"data"`, and you log it.
6. The channel remains open until either side calls `.end()`.

---

## 5. Notes for revision (cheat sheet style)

- **TCP** = reliable, ordered, connection-oriented protocol on top of IP.
- Provides: reliability, ordering, error detection, flow control, congestion control.
- **Ports** = logical endpoints (server listens on one, client connects to it).
- **Socket** = abstraction representing an endpoint of a TCP connection.
- **Server flow**: create → bind → listen → accept → communicate.
- **Client flow**: create → connect → communicate → close.
- In Node.js:

  - `net.createServer(handler)` → makes a TCP server.
  - `socket.write(data)` → sends data.
  - `socket.on("data", cb)` → receives data.
  - `server.listen(port, host)` → starts listening.

- TCP handshake is invisible in Node, but always occurs.
- Data is a stream, not discrete messages. Splitting or framing is up to you.

---
