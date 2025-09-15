## **Serving Static Files in Express**

Static files are files that don’t change dynamically: HTML, CSS, JS, images, fonts, etc.
Express can **serve them automatically** from a directory.

---

### **2. Using `express.static`**

```js
const express = require("express");
const path = require("path");
const app = express();

// Serve files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));
```

- Files inside `public` folder are accessible directly via their name:

  - `public/index.html` → `http://localhost:3000/index.html`
  - `public/css/style.css` → `http://localhost:3000/css/style.css`

---

### **3. Serving under a URL prefix**

```js
app.use("/static", express.static(path.join(__dirname, "public")));
```

- Now files are accessed like:

  - `http://localhost:3000/static/index.html`

---

### **4. Notes / Tips**

- Automatically sets `Content-Type` based on file extension.
- Handles caching via `ETag` and `Last-Modified`.
- Can combine multiple static directories:

```js
app.use(express.static("public"));
app.use(express.static("assets"));
```

---

Here’s a **clean, Boss-style note** on sending status codes and JSON in Express:

---

## **Express: Sending Status Codes & JSON**

### **1. `res.status(code)`**

- Sets the HTTP **status code** for the response.
- Must be called **before sending the response**.

```js
app.get("/notfound", (req, res) => {
  res.status(404).send("Page not found");
});
```

---

### **2. `res.json(object)`**

- Sends a **JSON response** with correct `Content-Type` (`application/json`).
- Can be combined with `status()`:

```js
app.get("/users/:id", (req, res) => {
  const user = { id: req.params.id, name: "John" };

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
});
```

---

### **3. Notes / Tips**

- `res.send()` can send strings, buffers, or objects. Objects are auto-converted to JSON.
- `res.json()` **always sends JSON**, so it’s safer for APIs.
- **Chaining** works: `res.status(201).json({ success: true })`.

---
