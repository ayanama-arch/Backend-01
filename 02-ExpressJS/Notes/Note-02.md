## **Express Routing – Quick Notes**

### 1. What is Routing?

- Defines how app endpoints (URIs) respond to client requests.
- Based on **HTTP method + route path** → runs callback(s).
- Express “listens” for matches and calls the handler.

---

### 2. Route Methods

- `app.get(path, handler)` → Handle **GET** requests.
- `app.post(path, handler)` → Handle **POST** requests.
- `app.all(path, handler)` → Handle **all HTTP methods** at a route.
- `app.use(path, middleware)` → Attach middleware to a path.

---

### 3. Route Paths

- **String routes** → `"/"`, `"/about"`, `"/random.text"`.
- **String patterns** (Express 4 only):

  - `/ab?cd` → matches `acd`, `abcd`.
  - `/ab+cd` → matches `abcd`, `abbcd`, etc.
  - `/ab*cd` → matches `abcd`, `abXcd`.
  - `/ab(cd)?e` → matches `abe`, `abcde`.

- **Regex routes**:

  - `/a/` → matches anything containing “a”.
  - `/.*fly$/` → matches `butterfly`, `dragonfly`.

---

### 4. Route Parameters

- Named URL segments: `/users/:userId/books/:bookId`.
- Captured in `req.params`:

  ```js
  // /users/34/books/8989
  req.params = { userId: "34", bookId: "8989" };
  ```

- Can include `-` and `.` literally: `/flights/:from-:to`.
- Regex constraint: `/user/:id(\\d+)` → only numbers.

---

### 5. Route Handlers

- Single callback:

  ```js
  app.get("/a", (req, res) => res.send("A"));
  ```

- Multiple callbacks (must use `next()`):

  ```js
  app.get(
    "/b",
    (req, res, next) => {
      next();
    },
    (req, res) => res.send("B")
  );
  ```

- Array of callbacks: `app.get('/c', [cb0, cb1, cb2])`.

---

### 6. Response Methods (`res`)

- `res.send()` → Send response.
- `res.json()` → Send JSON.
- `res.download()` → Download file.
- `res.sendFile()` → Send file.
- `res.redirect()` → Redirect client.
- `res.render()` → Render a view.
- `res.end()` → End response.
- `res.sendStatus(code)` → Send status + message.

---

### 7. `app.route()`

- Chainable route handlers for same path:

  ```js
  app
    .route("/book")
    .get((req, res) => res.send("Get book"))
    .post((req, res) => res.send("Add book"))
    .put((req, res) => res.send("Update book"));
  ```

---

### 8. `express.Router` (Mini-app)

- Create modular routes.
- Example:

  ```js
  const router = express.Router();
  router.get("/", (req, res) => res.send("Birds home"));
  router.get("/about", (req, res) => res.send("About birds"));
  app.use("/birds", router);
  ```

- Middleware specific to router → `router.use(middleware)`.
- `mergeParams: true` if parent route params should be inherited.

---
