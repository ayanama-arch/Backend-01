# Morgan & Rotating-File-Stream Notes

## Morgan Library

### What is Morgan?

Morgan is an HTTP request logger middleware for Node.js applications. It logs HTTP requests with customizable formats and outputs.

### Installation

```bash
npm install morgan
```

### Basic Usage

#### 1. Simple Setup

```javascript
const express = require("express");
const morgan = require("morgan");
const app = express();

// Use predefined format
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000);
```

#### 2. Predefined Formats

```javascript
// Common Apache combined log format
app.use(morgan("combined"));

// Common Apache common log format
app.use(morgan("common"));

// Concise output colored by response status
app.use(morgan("dev"));

// Shorter than default, includes response time
app.use(morgan("short"));

// Minimal output
app.use(morgan("tiny"));
```

#### 3. Custom Format

```javascript
// Custom format string
app.use(morgan(":method :url :status :response-time ms"));

// Using tokens
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'
  )
);
```

#### 4. Custom Tokens

```javascript
// Define custom token
morgan.token("id", (req) => req.id);

// Use custom token
app.use(morgan(":id :method :url :response-time"));
```

#### 5. Conditional Logging

```javascript
// Only log errors
app.use(
  morgan("combined", {
    skip: (req, res) => res.statusCode < 400,
  })
);

// Only log in production
app.use(
  morgan("combined", {
    skip: (req, res) => process.env.NODE_ENV !== "production",
  })
);
```

---

## Rotating-File-Stream Library

### What is Rotating-File-Stream?

A Node.js package that creates a rotating write stream, automatically creating new files based on time or size limits.

### Installation

```bash
npm install rotating-file-stream
```

### Basic Usage

#### 1. Time-Based Rotation

```javascript
const rfs = require("rotating-file-stream");

// Rotate daily
const stream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: "./logs",
});

stream.write("Hello World\n");
```

#### 2. Size-Based Rotation

```javascript
const stream = rfs.createStream("access.log", {
  size: "10M", // rotate when file reaches 10MB
  path: "./logs",
});
```

#### 3. Combined with Morgan

```javascript
const express = require("express");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const path = require("path");

const app = express();

// Create rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "logs"),
  compress: "gzip", // compress rotated files
});

// Setup logger
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000);
```

### Advanced Configuration

#### 1. Multiple Options

```javascript
const stream = rfs.createStream("app.log", {
  interval: "1d", // rotate daily
  size: "10M", // or when 10MB
  path: "./logs", // log directory
  compress: "gzip", // compress rotated files
  maxFiles: 10, // keep only 10 files
  maxSize: "100M", // total size limit
});
```

#### 2. Custom Filename Generator

```javascript
const stream = rfs.createStream(
  (time, index) => {
    if (!time) return "current.log";

    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, "0");
    const day = String(time.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}.log`;
  },
  {
    interval: "1d",
    path: "./logs",
  }
);
```

---

## Complete Production Example

```javascript
const express = require("express");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const path = require("path");
const fs = require("fs");

const app = express();

// Ensure log directory exists
const logDirectory = path.join(__dirname, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create rotating write stream for access logs
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory, // log directory
  compress: "gzip", // compress rotated files
  maxFiles: 14, // keep 14 days of logs
  maxSize: "100M", // max total size
});

// Create rotating write stream for error logs
const errorLogStream = rfs.createStream("error.log", {
  interval: "1d",
  path: logDirectory,
  compress: "gzip",
  maxFiles: 30,
});

// Log all requests
app.use(morgan("combined", { stream: accessLogStream }));

// Log only errors to console in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Log errors to separate file
app.use(
  morgan("combined", {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400,
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/error", (req, res) => {
  res.status(500).json({ error: "Something went wrong!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  errorLogStream.write(`${new Date().toISOString()} - ${err.stack}\n`);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Common Patterns

### 1. Environment-Specific Logging

```javascript
const isDevelopment = process.env.NODE_ENV === "development";

if (isDevelopment) {
  // Console logging for development
  app.use(morgan("dev"));
} else {
  // File logging for production
  app.use(morgan("combined", { stream: accessLogStream }));
}
```

### 2. Multiple Log Files

```javascript
// Access logs
const accessLogStream = rfs.createStream("access.log", options);
app.use(morgan("combined", { stream: accessLogStream }));

// Error logs
const errorLogStream = rfs.createStream("error.log", options);
app.use(
  morgan("combined", {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400,
  })
);

// API logs
const apiLogStream = rfs.createStream("api.log", options);
app.use("/api", morgan("combined", { stream: apiLogStream }));
```

### 3. Custom Log Format with Rotation

```javascript
// Custom format for structured logging
morgan.token("body", (req) => JSON.stringify(req.body));

const customFormat =
  ":remote-addr :method :url :status :response-time ms :body";

const stream = rfs.createStream("custom.log", {
  interval: "1h", // rotate hourly
  path: "./logs",
  compress: "gzip",
});

app.use(morgan(customFormat, { stream }));
```

---

## Key Benefits

### Morgan

- **Easy Setup**: Simple middleware integration
- **Flexible Formats**: Predefined and custom formats
- **Conditional Logging**: Skip certain requests
- **Performance**: Minimal overhead

### Rotating-File-Stream

- **Automatic Rotation**: Time or size-based
- **Compression**: Automatic gzip compression
- **File Management**: Automatic cleanup of old files
- **Memory Efficient**: Streams don't load entire file into memory

---

## Best Practices

1. **Use appropriate log levels** for different environments
2. **Rotate logs regularly** to prevent disk space issues
3. **Compress old logs** to save space
4. **Set retention policies** to automatically clean up old logs
5. **Monitor log file sizes** and rotation frequency
6. **Use structured logging** for better parsing and analysis
7. **Separate access and error logs** for easier debugging
