# 🚀 Express.js Quickstart Guide

## 📦 Installation

```bash
# Install Express (make sure spelling is correct: only 2 "s")
npm install express
```

---

## 🟢 Basic Example

```js
const express = require("express");
const app = express();
const port = 3000;

// Define a route for GET /
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
```

👉 **Note:**

- `req` (request) and `res` (response) are the same Node.js HTTP objects under the hood.
- That means you can still use low-level methods like:

  - `req.on("data", callback)`
  - `req.pipe(destination)`

- Express just gives you a simpler API on top.

---

## 📌 Basic Routing

Routing = defining how your app responds to different HTTP methods & URLs.

```js
// app.METHOD(PATH, HANDLER)

// GET request
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// POST request
app.post("/", (req, res) => {
  res.send("Got a POST request");
});

// PUT request
app.put("/user", (req, res) => {
  res.send("Got a PUT request at /user");
});

// DELETE request
app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});
```

👉 **Common Methods:**

- `GET` → Fetch data
- `POST` → Create new data
- `PUT` → Update/replace data
- `PATCH` → Partially update data
- `DELETE` → Remove data

---

## 📂 Serving Static Files

Express can serve static assets (HTML, CSS, JS, images, etc.) without you writing routes for each.

```js
// Serve files from "public" folder at root
app.use(express.static("public"));

// Create a virtual path prefix (e.g., http://localhost:3000/static/file.jpg)
app.use("/static", express.static("public"));
```

👉 **Example:**

- File: `public/style.css`
- Access via:

  - `http://localhost:3000/style.css`
  - `http://localhost:3000/static/style.css`

---

## 🧩 Middleware (Essential Concept)

Middleware are functions that run **before your route handlers**. They can modify `req` and `res` or end the request.

```js
// A simple middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next(); // pass control to the next middleware/route
});
```

---

## 🔑 Summary

- `npm install express` → get Express
- `app.listen()` → start your server
- `app.METHOD(PATH, HANDLER)` → define routes
- `express.static()` → serve static files
- Middleware = extra functionality plugged into the request/response cycle

---
