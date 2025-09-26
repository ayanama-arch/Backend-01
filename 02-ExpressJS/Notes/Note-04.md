## **Express Error Handling – Notes**

### **1. What is Error Handling?**

- Error handling in Express = how the framework catches and processes errors in **synchronous** and **asynchronous** code.
- Express has a **default error handler**; you don’t need to write one to start.

---

### **2. Catching Errors**

#### **Synchronous Code**

- Errors thrown inside route handlers or middleware are automatically caught by Express.

```js
app.get("/", (req, res) => {
  throw new Error("BROKEN"); // Express catches it automatically
});
```

#### **Asynchronous Code**

- Errors in async operations must be passed to `next()` for Express to handle.

```js
app.get("/", (req, res, next) => {
  fs.readFile("/file-does-not-exist", (err, data) => {
    if (err) next(err);
    else res.send(data);
  });
});
```

- **Express 5+**: Promises in route handlers automatically call `next(err)` if rejected.

```js
app.get("/user/:id", async (req, res, next) => {
  const user = await getUserById(req.params.id);
  res.send(user);
});
```

- **Important**: Passing **anything to `next()`** (except `'route'`) signals an error.

---

### **3. Simplifying Asynchronous Error Handling**

- Use `next` as callback for async functions:

```js
app.get("/", [
  (req, res, next) => fs.writeFile("/path", "data", next),
  (req, res) => res.send("OK"),
]);
```

- Or with `try…catch` inside `setTimeout` or callbacks:

```js
app.get("/", (req, res, next) => {
  setTimeout(() => {
    try {
      throw new Error("BROKEN");
    } catch (err) {
      next(err);
    }
  }, 100);
});
```

- Or use **Promises**:

```js
app.get("/", (req, res, next) => {
  Promise.resolve()
    .then(() => {
      throw new Error("BROKEN");
    })
    .catch(next);
});
```

---

### **4. Default Error Handler**

- Express has a built-in error handler:

  - Added at the **end of middleware stack**.
  - Writes errors to client (stack trace not in production).

- Response behavior:

  - `res.statusCode` from `err.status` or defaults to `500`.
  - `res.statusMessage` according to status code.
  - `err.stack` included in dev, not in production (`NODE_ENV=production`).
  - Any headers in `err.headers` are added.
  - If headers already sent → Express closes connection.

- Custom handler should delegate to default if headers sent:

```js
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  res.status(500).render("error", { error: err });
}
```

---

### **5. Writing Custom Error Handlers**

- **Signature**: `(err, req, res, next)`
- Define **after all routes and middleware**.

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

- Multiple error handlers can exist, e.g., logging, client response, generic error:

```js
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
```

- Examples:

```js
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) res.status(500).send({ error: "Something failed!" });
  else next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500).render("error", { error: err });
}
```

- **Important**: If you don’t call `next()` in error middleware, you must end the response.

---

### **6. Skipping Route Handlers**

- Use `next('route')` to skip remaining handlers for a route.

```js
app.get(
  "/premium",
  (req, res, next) => {
    if (!req.user.hasPaid) next("route"); // skip next handler
    else next();
  },
  (req, res, next) => {
    PaidContent.find((err, doc) => {
      if (err) next(err);
      else res.json(doc);
    });
  }
);
```

---

### **7. Key Takeaways**

1. **Synchronous errors** → automatically caught.
2. **Asynchronous errors** → pass to `next(err)` or use Promise `.catch(next)`.
3. **Error middleware** = 4 args `(err, req, res, next)`.
4. **Default handler** used if no custom handler handles the error.
5. **Order matters** → define error handlers after all routes/middleware.
6. **Do not leave responses hanging** → always end response if you handle error.
7. **Skip handlers** → use `next('route')`.

---
