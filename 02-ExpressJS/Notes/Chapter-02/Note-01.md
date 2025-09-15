# Complete Guide to CORS and Preflight Requests

## Table of Contents

1. [Introduction to CORS](#introduction-to-cors)
2. [Why CORS Exists](#why-cors-exists)
3. [Types of Requests](#types-of-requests)
4. [Preflight Requests](#preflight-requests)
5. [CORS Headers](#cors-headers)
6. [Implementation Examples](#implementation-examples)
7. [Common Issues and Solutions](#common-issues-and-solutions)
8. [Security Best Practices](#security-best-practices)
9. [Advanced Topics](#advanced-topics)

## Introduction to CORS

**Cross-Origin Resource Sharing (CORS)** is a web standard that allows servers to specify which origins are permitted to access their resources from a web browser. It's a security feature implemented by web browsers to prevent malicious websites from accessing resources from other domains without permission.

### Key Concepts

- **Origin**: Combination of protocol, domain, and port (e.g., `https://example.com:443`)
- **Same-Origin Policy**: Browser security feature that restricts cross-origin requests
- **Cross-Origin Request**: Request made to a different origin than the one serving the web page

## Why CORS Exists

### The Problem

Without CORS, the Same-Origin Policy would completely block all cross-origin requests, making it impossible for legitimate web applications to:

- Access APIs on different domains
- Load resources from CDNs
- Communicate with third-party services

### The Solution

CORS provides a controlled way to relax the Same-Origin Policy by:

- Allowing servers to specify which origins can access their resources
- Enabling browsers to check permissions before making certain requests
- Providing a secure mechanism for cross-origin communication

## Types of Requests

### Simple Requests

Requests that don't trigger a preflight check. Must meet ALL these criteria:

**Allowed Methods:**

- GET
- HEAD
- POST

**Allowed Headers (only these):**

- Accept
- Accept-Language
- Content-Language
- Content-Type (with restrictions)
- Range

**Content-Type Restrictions:**

- application/x-www-form-urlencoded
- multipart/form-data
- text/plain

### Non-Simple (Preflighted) Requests

Any request that doesn't meet simple request criteria, including:

- Custom headers (Authorization, X-Requested-With, etc.)
- Methods like PUT, DELETE, PATCH
- Content-Type: application/json
- Requests with credentials

## Preflight Requests

### What is a Preflight Request?

A preflight request is an automatic HTTP OPTIONS request sent by the browser before making the actual cross-origin request. It's used to check if the actual request is allowed.

### When Preflight Happens

- Non-simple requests
- Requests with custom headers
- Requests with credentials (cookies, authorization headers)
- Requests with certain Content-Types

### Preflight Flow

1. Browser sends OPTIONS request to target origin
2. Server responds with allowed methods, headers, and origins
3. Browser evaluates the response
4. If allowed, browser sends the actual request
5. If not allowed, browser blocks the request with CORS error

### Example Preflight Exchange

**Preflight Request:**

```http
OPTIONS /api/data HTTP/1.1
Host: api.example.com
Origin: https://myapp.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

**Preflight Response:**

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

## CORS Headers

### Request Headers (sent by browser)

#### `Origin`

- Present in all CORS requests
- Indicates the origin of the requesting site
- Cannot be modified by JavaScript

#### `Access-Control-Request-Method`

- Used in preflight requests only
- Indicates the HTTP method of the actual request

#### `Access-Control-Request-Headers`

- Used in preflight requests only
- Lists headers that will be sent in the actual request

### Response Headers (sent by server)

#### `Access-Control-Allow-Origin`

- **Most important CORS header**
- Specifies which origins can access the resource
- Values:
  - `*` (wildcard - allows all origins, but not with credentials)
  - Specific origin: `https://example.com`
  - `null` (rarely used, generally unsafe)

#### `Access-Control-Allow-Methods`

- Lists HTTP methods allowed for cross-origin requests
- Used in preflight responses
- Example: `GET, POST, PUT, DELETE, OPTIONS`

#### `Access-Control-Allow-Headers`

- Lists headers that can be sent in actual requests
- Used in preflight responses
- Example: `Content-Type, Authorization, X-Requested-With`

#### `Access-Control-Allow-Credentials`

- Indicates if credentials (cookies, authorization headers) are allowed
- Values: `true` or omitted (false)
- Cannot be used with `Access-Control-Allow-Origin: *`

#### `Access-Control-Max-Age`

- Specifies how long preflight results can be cached (in seconds)
- Reduces number of preflight requests
- Example: `86400` (24 hours)

#### `Access-Control-Expose-Headers`

- Lists headers that JavaScript can access in the response
- By default, only simple response headers are accessible
- Example: `X-Total-Count, X-Page-Number`

## Implementation Examples

### Server-Side Implementation

#### Node.js/Express

```javascript
const express = require("express");
const app = express();

// Basic CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://myapp.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "86400");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Using cors middleware
const cors = require("cors");
app.use(
  cors({
    origin: ["https://myapp.com", "https://anotherapp.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);
```

#### Python/Flask

```python
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=['https://myapp.com'],
     methods=['GET', 'POST', 'PUT', 'DELETE'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True)

# Or for specific routes
@app.route('/api/data', methods=['GET', 'POST'])
@cross_origin(origins=['https://myapp.com'], credentials=True)
def api_data():
    return {'message': 'Hello World'}
```

#### Java/Spring Boot

```java
@RestController
@CrossOrigin(origins = "https://myapp.com",
             allowCredentials = "true",
             methods = {RequestMethod.GET, RequestMethod.POST},
             allowedHeaders = {"Content-Type", "Authorization"})
public class ApiController {

    @GetMapping("/api/data")
    public ResponseEntity<String> getData() {
        return ResponseEntity.ok("Hello World");
    }
}

// Global CORS configuration
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://myapp.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### Client-Side Examples

#### JavaScript Fetch

```javascript
// Simple request (no preflight)
fetch("https://api.example.com/data", {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// Complex request (triggers preflight)
fetch("https://api.example.com/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
  },
  credentials: "include", // Include cookies
  body: JSON.stringify({ name: "John" }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

#### XMLHttpRequest

```javascript
const xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.example.com/data");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", "Bearer token123");
xhr.withCredentials = true; // Include credentials
xhr.onload = function () {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  }
};
xhr.send(JSON.stringify({ name: "John" }));
```

## Common Issues and Solutions

### 1. CORS Error: "No 'Access-Control-Allow-Origin' header"

**Problem:** Server doesn't send CORS headers
**Solution:** Configure server to send appropriate CORS headers

### 2. CORS Error with Credentials

**Problem:** Using `*` wildcard with credentials

```javascript
// Wrong
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Credentials", "true");
```

**Solution:** Specify exact origins when using credentials

```javascript
// Correct
res.header("Access-Control-Allow-Origin", "https://myapp.com");
res.header("Access-Control-Allow-Credentials", "true");
```

### 3. Preflight Request Failing

**Problem:** Server doesn't handle OPTIONS requests
**Solution:** Ensure server responds to OPTIONS with appropriate headers

### 4. Custom Headers Not Allowed

**Problem:** Server doesn't list custom headers in `Access-Control-Allow-Headers`
**Solution:** Add custom headers to the allowed list

### 5. Method Not Allowed

**Problem:** HTTP method not listed in `Access-Control-Allow-Methods`
**Solution:** Add the method to allowed methods list

## Security Best Practices

### 1. Avoid Wildcard Origins in Production

```javascript
// Avoid in production
res.header("Access-Control-Allow-Origin", "*");

// Use specific origins
const allowedOrigins = ["https://myapp.com", "https://myapp.io"];
const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.header("Access-Control-Allow-Origin", origin);
}
```

### 2. Validate Origins Dynamically

```javascript
function isValidOrigin(origin) {
  const allowedOrigins = ["https://myapp.com", "https://staging.myapp.com"];
  return allowedOrigins.includes(origin);
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isValidOrigin(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  next();
});
```

### 3. Limit Exposed Headers

```javascript
// Only expose necessary headers
res.header("Access-Control-Expose-Headers", "X-Total-Count, X-Page");
```

### 4. Use Appropriate Max-Age

```javascript
// Cache preflight for 1 hour in development
res.header("Access-Control-Max-Age", "3600");

// Cache for 24 hours in production
res.header("Access-Control-Max-Age", "86400");
```

## Advanced Topics

### 1. Conditional CORS

```javascript
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const userAgent = req.headers["user-agent"];

  // Only allow CORS for browsers, not for server-to-server requests
  if (userAgent && userAgent.includes("Mozilla")) {
    if (isValidOrigin(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }
  }
  next();
});
```

### 2. CORS with Different Configurations per Route

```javascript
const publicCors = cors({
  origin: "*",
  methods: ["GET"],
});

const privateCors = cors({
  origin: ["https://myapp.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.get("/public/*", publicCors, publicRoutes);
app.use("/private/*", privateCors, privateRoutes);
```

### 3. CORS Caching Strategies

```javascript
// Different caching for different environments
const maxAge = process.env.NODE_ENV === "production" ? 86400 : 0;

app.use(
  cors({
    origin: allowedOrigins,
    maxAge: maxAge,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);
```

### 4. Debugging CORS Issues

#### Browser Developer Tools

1. Check Network tab for preflight requests
2. Look for CORS error messages in Console
3. Examine request/response headers

#### Server-Side Logging

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Origin:", req.headers.origin);
  console.log("Request Headers:", req.headers);

  // Log response headers after they're set
  const originalSend = res.send;
  res.send = function (data) {
    console.log("Response Headers:", res.getHeaders());
    originalSend.call(this, data);
  };

  next();
});
```

### 5. CORS Proxies for Development

```javascript
// Using http-proxy-middleware for development
const { createProxyMiddleware } = require("http-proxy-middleware");

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://external-api.com",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);
```

### 6. CORS and WebSockets

WebSocket connections have their own origin checking mechanism:

```javascript
const WebSocket = require("ws");

const wss = new WebSocket.Server({
  port: 8080,
  verifyClient: (info) => {
    const origin = info.origin;
    return allowedOrigins.includes(origin);
  },
});
```

## Summary

CORS is a critical web security mechanism that enables controlled cross-origin resource sharing. Key takeaways:

1. **Understand the types**: Simple vs. preflighted requests
2. **Configure properly**: Set appropriate headers for your use case
3. **Security first**: Avoid wildcards in production, validate origins
4. **Debug effectively**: Use browser tools and server-side logging
5. **Test thoroughly**: Test all request types and scenarios

Remember that CORS is enforced by browsers, not servers. Server-to-server requests don't involve CORS, and CORS cannot protect against all types of attacks - it's just one layer in a comprehensive security strategy.
