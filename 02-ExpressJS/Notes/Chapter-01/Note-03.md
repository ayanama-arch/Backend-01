# Complete Express.js HTTP Methods Notes

## 1. Introduction to HTTP Methods in Express

HTTP methods (also called HTTP verbs) define the action to be performed on a resource. Express.js provides methods that correspond to HTTP verbs, allowing you to handle different types of requests.

### Basic Syntax:

```javascript
app.METHOD(PATH, HANDLER);
```

Where:

- **METHOD**: HTTP method (get, post, put, delete, etc.)
- **PATH**: Route path on the server
- **HANDLER**: Function executed when route is matched

## 2. GET Method

The GET method requests data from a specified resource. It should only retrieve data and have no side effects.

### Basic Usage:

```javascript
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  res.json({ users: ["John", "Jane", "Bob"] });
});
```

### GET with Parameters:

```javascript
// Route parameters
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.json({ userId: userId });
});

// Multiple route parameters
app.get("/users/:userId/posts/:postId", (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
```

### GET with Query String:

```javascript
// URL: /products?category=electronics&sort=price&order=asc
app.get("/products", (req, res) => {
  const { category, sort, order } = req.query;
  res.json({
    category: category,
    sort: sort,
    order: order || "asc",
  });
});
```

## 3. POST Method

The POST method submits data to be processed to a specified resource. It's used to create new resources.

### Basic Usage:

```javascript
app.post("/users", (req, res) => {
  const newUser = req.body;
  // Save user to database
  const savedUser = createUser(newUser);
  res.status(201).json(savedUser);
});
```

## 4. PUT Method

The PUT method updates a complete resource or creates it if it doesn't exist. It replaces the entire resource.

### Basic Usage:

```javascript
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  // Update entire user resource
  const user = updateUser(userId, updatedUser);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});
```

### PUT vs POST for Creation:

```javascript
// PUT can create if resource doesn't exist
app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  let user = getUserById(userId);

  if (user) {
    // Update existing user
    user = updateUser(userId, userData);
    res.json(user);
  } else {
    // Create new user with specified ID
    const newUser = { id: userId, ...userData };
    user = createUser(newUser);
    res.status(201).json(user);
  }
});
```

## 5. PATCH Method

The PATCH method applies partial modifications to a resource. It updates only specified fields.

### Basic Usage:

```javascript
app.patch("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Apply partial updates
  const updatedUser = { ...user, ...updates, updatedAt: new Date() };
  const result = updateUser(userId, updatedUser);

  res.json(result);
});
```

## 6. DELETE Method

The DELETE method deletes a specified resource.

### Basic Usage:

```javascript
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  deleteUser(userId);
  res.status(204).send(); // 204 No Content
});
```

## 7. HEAD Method

The HEAD method is identical to GET but returns only headers, no body.

```javascript
app.head("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const user = getUserById(userId);

  if (user) {
    res.set({
      "Content-Type": "application/json",
      "Content-Length": JSON.stringify(user).length,
      "Last-Modified": user.updatedAt,
    });
    res.status(200).end();
  } else {
    res.status(404).end();
  }
});
```

## 8. OPTIONS Method

The OPTIONS method returns allowed HTTP methods for a resource. Often used for CORS preflight requests.

```javascript
app.options("/api/users", (req, res) => {
  res.set({
    Allow: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.status(200).end();
});
```

## 9. ALL Method

The `app.all()` method matches all HTTP methods.

```javascript
// Middleware that runs for all HTTP methods
app.all("/api/*", (req, res, next) => {
  console.log(`${req.method} request to ${req.path}`);
  next();
});

// Handle all methods for specific route
app.all("/api/debug", (req, res) => {
  res.json({
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });
});
```

## 10. Method-Specific Middleware

```javascript
// Apply middleware only to POST requests
app.post(
  "/api/users",
  express.json(),
  validateUser,
  authenticateToken,
  (req, res) => {
    // Handle POST request
  }
);

// Different middleware for different methods on same route
app
  .route("/api/users/:id")
  .get((req, res) => {
    // GET logic
  })
  .put(authenticateToken, validateUser, (req, res) => {
    // PUT logic with authentication
  })
  .delete(authenticateToken, requireAdmin, (req, res) => {
    // DELETE logic with admin check
  });
```
