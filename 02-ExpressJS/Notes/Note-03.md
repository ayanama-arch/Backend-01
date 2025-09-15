# 📌 Express Middleware – Notes

## 🔹 What is Middleware?

- Functions with access to:

  - `req` → request object
  - `res` → response object
  - `next` → function to pass control to the next middleware

- Tasks they can do:

  - Execute any code
  - Modify `req` or `res`
  - End request-response cycle
  - Call `next()` to continue

⚠️ If you don’t end cycle or call `next()`, request will hang.

---

## 🔹 Types of Middleware

1. **Application-level** → bound to `app` via `app.use()` or `app.METHOD()`.
2. **Router-level** → bound to an `express.Router()` instance.
3. **Error-handling** → functions with 4 args `(err, req, res, next)`.
4. **Built-in** → e.g. `express.static`, `express.json`, `express.urlencoded`.
5. **Third-party** → e.g. `cookie-parser`, `morgan`, `cors`.

---

## 🔹 Examples

### 1. Application-level middleware

```js
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});
```

Mounted on specific path:

```js
app.use("/user/:id", (req, res, next) => {
  console.log("Request Type:", req.method);
  next();
});
```

---

### 2. Router-level middleware

```js
const router = express.Router();

router.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

router.get("/user/:id", (req, res) => {
  res.send("Hello User");
});

app.use("/", router);
```

Skip router with `next('router')`.

---

### 3. Error-handling middleware

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

---

### 4. Built-in middleware

- `express.static` → serve static files
- `express.json` → parse JSON requests
- `express.urlencoded` → parse URL-encoded requests

---

### 5. Third-party middleware

Install & use:

```bash
npm install cookie-parser
```

```js
const cookieParser = require("cookie-parser");
app.use(cookieParser());
```

---

## 🔹 Special Notes

- Order of middleware matters → first loaded, first executed.
- `next('route')` → skips to next route handler.
- Middleware can be combined in arrays for reuse.
- Configurable middleware → export a function returning middleware.

---

👉 In short: **Express apps = middleware chain + routes.**
Each middleware either handles the request, modifies it, or passes it along.

---
