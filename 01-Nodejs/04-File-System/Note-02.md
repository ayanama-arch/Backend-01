# Node.js File System (fs) Module - Complete Notes

## Overview

The `fs` module provides an API for interacting with the file system. It offers both synchronous and asynchronous methods for file operations.

```javascript
const fs = require("fs");
const fsPromises = require("fs").promises; // Promise-based version
// OR
const fs = require("fs/promises"); // ES6 modules
```

## Key Concepts

### Synchronous vs Asynchronous

- **Synchronous**: Blocks execution until operation completes (suffix: `Sync`)
- **Asynchronous**: Non-blocking, uses callbacks or promises
- **Promise-based**: Modern async approach using `fs.promises`

### File Descriptors

- Numeric identifiers that refer to open files
- Used in low-level file operations
- Must be closed after use to prevent memory leaks

## Core Methods

### Reading Files

#### `fs.readFile()`

```javascript
// Async with callback
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise-based
const data = await fs.promises.readFile("file.txt", "utf8");

// Synchronous
const data = fs.readFileSync("file.txt", "utf8");
```

#### `fs.readdir()`

```javascript
// Read directory contents
fs.readdir("./directory", (err, files) => {
  if (err) throw err;
  console.log(files); // Array of filenames
});

// With file types
fs.readdir("./directory", { withFileTypes: true }, (err, dirents) => {
  dirents.forEach((dirent) => {
    console.log(dirent.name, dirent.isDirectory());
  });
});
```

### Writing Files

#### `fs.writeFile()`

```javascript
// Creates new file or overwrites existing
fs.writeFile("output.txt", "Hello World", (err) => {
  if (err) throw err;
  console.log("File saved!");
});

// With options
fs.writeFile(
  "output.txt",
  "Hello World",
  {
    encoding: "utf8",
    flag: "w", // 'w' = write, 'a' = append
  },
  callback
);
```

#### `fs.appendFile()`

```javascript
// Appends data to file
fs.appendFile("log.txt", "New log entry\n", (err) => {
  if (err) throw err;
  console.log("Data appended!");
});
```

### File Operations

#### `fs.copyFile()`

```javascript
fs.copyFile("source.txt", "destination.txt", (err) => {
  if (err) throw err;
  console.log("File copied!");
});
```

#### `fs.rename()` / `fs.move()`

```javascript
fs.rename("oldname.txt", "newname.txt", (err) => {
  if (err) throw err;
  console.log("File renamed!");
});
```

#### `fs.unlink()` (Delete File)

```javascript
fs.unlink("file-to-delete.txt", (err) => {
  if (err) throw err;
  console.log("File deleted!");
});
```

### Directory Operations

#### `fs.mkdir()`

```javascript
// Create directory
fs.mkdir("new-directory", (err) => {
  if (err) throw err;
  console.log("Directory created!");
});

// Create nested directories
fs.mkdir("path/to/nested/dir", { recursive: true }, callback);
```

#### `fs.rmdir()` / `fs.rm()`

```javascript
// Remove empty directory
fs.rmdir("directory-name", (err) => {
  if (err) throw err;
  console.log("Directory removed!");
});

// Remove directory and contents (Node.js 14.14.0+)
fs.rm("directory-name", { recursive: true, force: true }, callback);
```

### File Information

#### `fs.stat()`

```javascript
fs.stat("file.txt", (err, stats) => {
  if (err) throw err;

  console.log(stats.isFile()); // true if file
  console.log(stats.isDirectory()); // true if directory
  console.log(stats.size); // file size in bytes
  console.log(stats.mtime); // last modified time
  console.log(stats.ctime); // creation time
});
```

#### `fs.exists()` (Deprecated - use `fs.access()`)

```javascript
// Check if file exists
fs.access("file.txt", fs.constants.F_OK, (err) => {
  if (err) {
    console.log("File does not exist");
  } else {
    console.log("File exists");
  }
});

// Check permissions
fs.access("file.txt", fs.constants.R_OK | fs.constants.W_OK, callback);
```

## Streams

### Reading Streams

```javascript
const readStream = fs.createReadStream("large-file.txt", {
  encoding: "utf8",
  highWaterMark: 16 * 1024, // 16KB chunks
});

readStream.on("data", (chunk) => {
  console.log("Received chunk:", chunk);
});

readStream.on("end", () => {
  console.log("Reading completed");
});

readStream.on("error", (err) => {
  console.error("Error:", err);
});
```

### Writing Streams

```javascript
const writeStream = fs.createWriteStream("output.txt");

writeStream.write("First line\n");
writeStream.write("Second line\n");
writeStream.end("Final line\n");

writeStream.on("finish", () => {
  console.log("Writing completed");
});
```

## File Watching

#### `fs.watch()`

```javascript
fs.watch("file.txt", (eventType, filename) => {
  console.log(`Event: ${eventType}`);
  if (filename) {
    console.log(`Filename: ${filename}`);
  }
});

// Watch directory
fs.watch("./directory", { recursive: true }, (eventType, filename) => {
  console.log(`${filename} was ${eventType}`);
});
```

#### `fs.watchFile()`

```javascript
fs.watchFile("file.txt", (curr, prev) => {
  console.log("File was modified");
  console.log(`Current mtime: ${curr.mtime}`);
  console.log(`Previous mtime: ${prev.mtime}`);
});

// Stop watching
fs.unwatchFile("file.txt");
```

## Constants

### File Access Constants

```javascript
fs.constants.F_OK; // File exists
fs.constants.R_OK; // File is readable
fs.constants.W_OK; // File is writable
fs.constants.X_OK; // File is executable
```

### File Open Constants

```javascript
fs.constants.O_RDONLY; // Read only
fs.constants.O_WRONLY; // Write only
fs.constants.O_RDWR; // Read and write
fs.constants.O_CREAT; // Create file if it doesn't exist
fs.constants.O_EXCL; // Fail if file exists
fs.constants.O_TRUNC; // Truncate file to zero length
fs.constants.O_APPEND; // Append mode
```

## Error Handling

### Common Error Codes

- `ENOENT`: File or directory doesn't exist
- `EACCES`: Permission denied
- `EEXIST`: File already exists
- `EISDIR`: Expected file but got directory
- `ENOTDIR`: Expected directory but got file
- `EMFILE`: Too many open files

### Error Handling Patterns

```javascript
// Callback pattern
fs.readFile("file.txt", (err, data) => {
  if (err) {
    if (err.code === "ENOENT") {
      console.log("File not found");
    } else {
      console.error("Unexpected error:", err);
    }
    return;
  }
  // Process data
});

// Promise pattern
try {
  const data = await fs.promises.readFile("file.txt", "utf8");
  // Process data
} catch (err) {
  if (err.code === "ENOENT") {
    console.log("File not found");
  } else {
    throw err;
  }
}
```

## Best Practices

### 1. Use Promises or Async/Await

```javascript
// Preferred
async function readMultipleFiles() {
  try {
    const file1 = await fs.promises.readFile("file1.txt", "utf8");
    const file2 = await fs.promises.readFile("file2.txt", "utf8");
    return { file1, file2 };
  } catch (error) {
    console.error("Error reading files:", error);
  }
}
```

### 2. Use Streams for Large Files

```javascript
// For large files, use streams instead of readFile
const readStream = fs.createReadStream("large-file.txt");
const writeStream = fs.createWriteStream("processed-file.txt");

readStream.pipe(writeStream);
```

### 3. Always Handle Errors

```javascript
// Don't ignore errors
fs.readFile("file.txt", (err, data) => {
  if (err) {
    console.error("Failed to read file:", err);
    return;
  }
  // Process data
});
```

### 4. Close File Descriptors

```javascript
// When using fs.open()
fs.open("file.txt", "r", (err, fd) => {
  if (err) throw err;

  // Use file descriptor
  // ...

  // Always close
  fs.close(fd, (err) => {
    if (err) throw err;
    console.log("File closed");
  });
});
```

### 5. Use Path Module for Cross-Platform Compatibility

```javascript
const path = require("path");

// Instead of hardcoded paths
const filePath = path.join(__dirname, "data", "file.txt");
fs.readFile(filePath, callback);
```

## Common Use Cases

### 1. Read JSON Configuration

```javascript
async function loadConfig() {
  try {
    const data = await fs.promises.readFile("config.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load config:", error);
    return {};
  }
}
```

### 2. Log to File

```javascript
function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: ${message}\n`;

  fs.appendFile("app.log", logEntry, (err) => {
    if (err) console.error("Failed to write log:", err);
  });
}
```

### 3. File Upload Processing

```javascript
async function processUpload(buffer, filename) {
  const uploadPath = path.join("uploads", filename);

  try {
    await fs.promises.writeFile(uploadPath, buffer);
    console.log(`File uploaded: ${filename}`);
    return uploadPath;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
```

### 4. Directory Traversal

```javascript
async function getAllFiles(dir) {
  const files = [];

  async function traverse(currentDir) {
    const items = await fs.promises.readdir(currentDir, {
      withFileTypes: true,
    });

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);

      if (item.isDirectory()) {
        await traverse(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  await traverse(dir);
  return files;
}
```

## Performance Tips

1. **Use streams for large files** to avoid loading entire file into memory
2. **Batch operations** when possible to reduce I/O overhead
3. **Use fs.constants** instead of string flags for better performance
4. **Consider using worker threads** for CPU-intensive file operations
5. **Cache file stats** if accessing the same files repeatedly
6. **Use fs.promises** with async/await for cleaner error handling
