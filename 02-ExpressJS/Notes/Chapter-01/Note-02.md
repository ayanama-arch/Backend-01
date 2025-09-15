# Complete Express.js Middleware Notes

## 1. What is Middleware?

Middleware functions are functions that have access to the **request object** (`req`), the **response object** (`res`), and the **next middleware function** in the application's request-response cycle. The next middleware function is commonly denoted by a variable named `next`.

## 2. Middleware Function Structure

```javascript
function middlewareName(req, res, next) {
  // Middleware logic here
  next(); // Call next middleware or route handler
}
```

### Parameters:

- **req**: The request object
- **res**: The response object
- **next**: Function to pass control to the next middleware

## 3. Types of Express Middleware

### 3.1 Application-Level Middleware

Bound to an instance of express using `app.use()` or `app.METHOD()`

```javascript
// Applies to all routes
app.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});

// Applies to specific path
app.use("/user/:id", function (req, res, next) {
  console.log("Request Type:", req.method);
  next();
});

// Applies to specific HTTP method and path
app.get("/user/:id", function (req, res, next) {
  res.send("USER");
});
```

### 3.2 Router-Level Middleware

Works the same as application-level middleware but bound to `express.Router()`

```javascript
const router = express.Router();

// Middleware specific to this router
router.use(function (req, res, next) {
  console.log("Router middleware");
  next();
});

router.get("/users/:id", function (req, res) {
  res.send("User info");
});

app.use("/api", router);
```

### 3.3 Error-Handling Middleware

Always takes **four arguments**: `(err, req, res, next)`

```javascript
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

### 3.4 Built-in Middleware

Express comes with built-in middleware functions:

```javascript
// Serve static files
app.use(express.static("public"));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
```

### 3.5 Third-Party Middleware

Popular third-party middleware packages:

```javascript
// CORS
const cors = require("cors");
app.use(cors());

// Morgan (logging)
const morgan = require("morgan");
app.use(morgan("combined"));

// Helmet (security)
const helmet = require("helmet");
app.use(helmet());

// Cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());
```

## 4. Middleware Execution Order

Middleware functions execute in the order they are defined:

```javascript
app.use(middleware1); // Executes first
app.use(middleware2); // Executes second
app.use(middleware3); // Executes third

app.get("/", handler); // Route handler executes last
```

## 10. Common Middleware Libraries

### 10.1 Essential Middleware

- **express.json()**: Parse JSON bodies
- **express.urlencoded()**: Parse URL-encoded bodies
- **express.static()**: Serve static files
- **cors**: Enable CORS
- **helmet**: Security headers
- **morgan**: HTTP request logging
- **compression**: Gzip compression

### 10.2 Authentication & Security

- **passport**: Authentication middleware
- **express-rate-limit**: Rate limiting
- **express-validator**: Request validation
- **jsonwebtoken**: JWT handling
- **bcrypt**: Password hashing

### 10.3 Utility Middleware

- **cookie-parser**: Parse cookies
- **multer**: File upload handling
- **express-session**: Session management
- **method-override**: HTTP method override
