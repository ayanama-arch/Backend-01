# Complete Multer Guide: Beginner to Advanced

## Table of Contents

1. [Introduction to Multer](#introduction)
2. [Installation and Setup](#installation)
3. [Basic File Upload](#basic-upload)
4. [Storage Configuration](#storage-configuration)
5. [File Filtering](#file-filtering)
6. [Field Configurations](#field-configurations)
7. [Error Handling](#error-handling)
8. [Advanced Features](#advanced-features)
9. [Security Best Practices](#security)
10. [Real-World Examples](#real-world-examples)
11. [Troubleshooting](#troubleshooting)

---

## 1. Introduction to Multer {#introduction}

Multer is a Node.js middleware for handling multipart/form-data, primarily used for uploading files. It's built on top of busboy for maximum efficiency and works only with forms that have `enctype="multipart/form-data"`.

### Key Features:

- File upload handling
- Memory and disk storage options
- File filtering and validation
- Multiple file uploads
- Field limit configuration
- Built-in security features

### When to Use Multer:

- User profile picture uploads
- Document/PDF uploads
- Image galleries
- File sharing applications
- CSV/Excel file processing
- Resume/CV uploads

---

## 2. Installation and Setup {#installation}

### Installation

```bash
npm install multer
npm install express  # Required for examples
```

### Basic Setup

```javascript
const express = require("express");
const multer = require("multer");
const app = express();

// Basic multer configuration
const upload = multer({ dest: "uploads/" });

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

## 3. Basic File Upload {#basic-upload}

### Single File Upload

```javascript
const express = require("express");
const multer = require("multer");
const app = express();

const upload = multer({ dest: "uploads/" });

// HTML form endpoint
app.get("/", (req, res) => {
  res.send(`
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="avatar" required>
            <button type="submit">Upload</button>
        </form>
    `);
});

// Single file upload endpoint
app.post("/upload", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("File info:", req.file);
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});
```

### Multiple Files Upload

```javascript
// Multiple files with same field name
app.post("/upload-multiple", upload.array("photos", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const fileInfos = req.files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
  }));

  res.json({
    message: `${req.files.length} files uploaded successfully`,
    files: fileInfos,
  });
});
```

### Mixed Fields Upload

```javascript
// Multiple fields with different names
const uploadFields = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);

app.post("/upload-mixed", uploadFields, (req, res) => {
  console.log("Avatar:", req.files["avatar"]);
  console.log("Gallery:", req.files["gallery"]);
  console.log("Text fields:", req.body);

  res.json({
    message: "Files uploaded successfully",
    avatar: req.files["avatar"] ? req.files["avatar"][0].filename : null,
    galleryCount: req.files["gallery"] ? req.files["gallery"].length : 0,
    textData: req.body,
  });
});
```

---

## 4. Storage Configuration {#storage-configuration}

### Disk Storage (Recommended for Production)

```javascript
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dynamic destination based on file type
    let uploadPath = "uploads/";

    if (file.mimetype.startsWith("image/")) {
      uploadPath = "uploads/images/";
    } else if (file.mimetype === "application/pdf") {
      uploadPath = "uploads/documents/";
    } else {
      uploadPath = "uploads/others/";
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + fileExtension;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
```

### Memory Storage (For Small Files)

```javascript
const memoryStorage = multer.memoryStorage();

const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for memory storage
  },
});

app.post("/upload-memory", uploadMemory.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // File is stored in memory as Buffer
  console.log("File buffer length:", req.file.buffer.length);
  console.log("File mimetype:", req.file.mimetype);

  // You can process the buffer directly
  // For example, save to database, send to cloud storage, etc.

  res.json({
    message: "File processed successfully",
    size: req.file.buffer.length,
    mimetype: req.file.mimetype,
  });
});
```

---

## 5. File Filtering {#file-filtering}

### Basic File Type Filter

```javascript
const fileFilter = (req, file, cb) => {
  // Accept only specific file types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
```

### Advanced File Filtering

```javascript
const advancedFileFilter = (req, file, cb) => {
  // Check file extension
  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".pdf",
    ".doc",
    ".docx",
  ];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  // Check mimetype
  const allowedMimetypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // Validate both extension and mimetype
  if (
    allowedExtensions.includes(fileExtension) &&
    allowedMimetypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not allowed. Allowed types: ${allowedExtensions.join(", ")}`
      ),
      false
    );
  }
};

// Field-specific filtering
const fieldSpecificFilter = (req, file, cb) => {
  if (file.fieldname === "avatar") {
    // Only images for avatar
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Avatar must be an image"), false);
    }
  } else if (file.fieldname === "resume") {
    // Only PDF for resume
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Resume must be a PDF"), false);
    }
  } else {
    cb(new Error("Unknown field"), false);
  }
};
```

---

## 6. Field Configurations {#field-configurations}

### Comprehensive Limits Configuration

```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
    files: 10, // Maximum 10 files
    fields: 20, // Maximum 20 non-file fields
    fieldNameSize: 100, // Maximum field name size
    fieldSize: 1024 * 1024, // Maximum field value size (1MB)
    headerPairs: 2000, // Maximum header pairs
  },
  fileFilter: fileFilter,
});
```

### Dynamic Field Handling

```javascript
// Create upload configuration based on user role
const createUploadConfig = (userRole) => {
  let maxFiles = 1;
  let maxSize = 1024 * 1024; // 1MB

  switch (userRole) {
    case "admin":
      maxFiles = 20;
      maxSize = 50 * 1024 * 1024; // 50MB
      break;
    case "premium":
      maxFiles = 10;
      maxSize = 20 * 1024 * 1024; // 20MB
      break;
    case "free":
      maxFiles = 3;
      maxSize = 5 * 1024 * 1024; // 5MB
      break;
  }

  return multer({
    storage: storage,
    limits: {
      fileSize: maxSize,
      files: maxFiles,
    },
    fileFilter: fileFilter,
  });
};

// Middleware to get user role and configure upload
const configureUpload = (req, res, next) => {
  const userRole = req.user?.role || "free"; // Assuming user info is available
  const uploadConfig = createUploadConfig(userRole);

  // Use the configured upload middleware
  uploadConfig.array("files")(req, res, next);
};

app.post("/upload-dynamic", authenticateUser, configureUpload, (req, res) => {
  res.json({
    message: "Files uploaded successfully",
    fileCount: req.files.length,
    userRole: req.user.role,
  });
});
```

---

## 7. Error Handling {#error-handling}

### Comprehensive Error Handling

```javascript
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          error: "File too large",
          message: "File size exceeds the maximum limit of 5MB",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          error: "Too many files",
          message: "Maximum 10 files allowed",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          error: "Unexpected field",
          message: "Unexpected file field",
        });
      case "LIMIT_FIELD_COUNT":
        return res.status(400).json({
          error: "Too many fields",
          message: "Too many form fields",
        });
      case "LIMIT_FIELD_SIZE":
        return res.status(400).json({
          error: "Field too large",
          message: "Field value too large",
        });
      default:
        return res.status(400).json({
          error: "Upload error",
          message: err.message,
        });
    }
  } else if (err) {
    // Custom errors from fileFilter
    return res.status(400).json({
      error: "File validation error",
      message: err.message,
    });
  }

  next();
};

// Usage
app.post(
  "/upload-with-error-handling",
  upload.single("file"),
  handleUploadError,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      message: "File uploaded successfully",
      file: req.file,
    });
  }
);
```

### Async Error Handling

```javascript
const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

app.post(
  "/upload-async",
  upload.single("file"),
  asyncErrorHandler(async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Simulate async operations (database save, image processing, etc.)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Additional file validation
      if (req.file.size > 5 * 1024 * 1024) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "File too large" });
      }

      res.json({
        message: "File processed successfully",
        file: req.file,
      });
    } catch (error) {
      // Clean up on error
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      throw error;
    }
  })
);
```

---

## 8. Advanced Features {#advanced-features}

### File Processing with Sharp (Image Manipulation)

```javascript
const sharp = require("sharp"); // npm install sharp

const processImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"), false);
    }
  },
});

app.post(
  "/upload-process-image",
  processImage.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const filename = Date.now() + "-processed.jpg";
      const outputPath = path.join("uploads/processed/", filename);

      // Create directory if it doesn't exist
      if (!fs.existsSync("uploads/processed/")) {
        fs.mkdirSync("uploads/processed/", { recursive: true });
      }

      // Process image: resize, optimize, convert to JPEG
      await sharp(req.file.buffer)
        .resize(800, 600, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      res.json({
        message: "Image processed successfully",
        filename: filename,
        originalSize: req.file.size,
        processedPath: outputPath,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Image processing failed", details: error.message });
    }
  }
);
```

### Cloud Storage Integration (AWS S3)

```javascript
const AWS = require("aws-sdk"); // npm install aws-sdk

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadToS3 = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

app.post("/upload-s3", uploadToS3.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read", // or 'private' based on your needs
    };

    const result = await s3.upload(uploadParams).promise();

    res.json({
      message: "File uploaded to S3 successfully",
      url: result.Location,
      key: result.Key,
      size: req.file.size,
    });
  } catch (error) {
    res.status(500).json({ error: "S3 upload failed", details: error.message });
  }
});
```

### Progress Tracking

```javascript
const multer = require("multer");
const uuid = require("uuid"); // npm install uuid

// Store upload progress
const uploadProgress = new Map();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const filename = uuid.v4() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const trackProgress = (req, res, next) => {
  const uploadId = req.headers["x-upload-id"] || uuid.v4();
  req.uploadId = uploadId;

  // Initialize progress tracking
  uploadProgress.set(uploadId, { progress: 0, total: 0 });

  // Track progress
  let totalSize = 0;
  let uploadedSize = 0;

  req.on("data", (chunk) => {
    uploadedSize += chunk.length;
    const progress = Math.round((uploadedSize / totalSize) * 100);
    uploadProgress.set(uploadId, { progress, total: totalSize });
  });

  req.on("end", () => {
    uploadProgress.set(uploadId, { progress: 100, total: totalSize });
  });

  next();
};

app.post(
  "/upload-progress",
  trackProgress,
  upload.single("file"),
  (req, res) => {
    res.json({
      message: "File uploaded successfully",
      uploadId: req.uploadId,
      file: req.file,
    });
  }
);

// Progress endpoint
app.get("/upload-progress/:uploadId", (req, res) => {
  const progress = uploadProgress.get(req.params.uploadId);
  if (progress) {
    res.json(progress);
  } else {
    res.status(404).json({ error: "Upload not found" });
  }
});
```

---

## 9. Security Best Practices {#security}

### File Validation and Sanitization

```javascript
const path = require("path");
const crypto = require("crypto");

const secureFileFilter = (req, file, cb) => {
  // Check file extension
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error("File type not allowed"), false);
  }

  // Check mimetype
  const allowedMimetypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];

  if (!allowedMimetypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }

  // Sanitize filename
  const sanitizedOriginalName = file.originalname
    .replace(/[^a-zA-Z0-9.\-_]/g, "_") // Replace special characters
    .replace(/_{2,}/g, "_"); // Replace multiple underscores

  file.originalname = sanitizedOriginalName;

  cb(null, true);
};

const secureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/secure/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate cryptographically secure filename
    const hash = crypto
      .createHash("sha256")
      .update(file.originalname + Date.now())
      .digest("hex");
    const extension = path.extname(file.originalname);
    cb(null, hash + extension);
  },
});

const secureUpload = multer({
  storage: secureStorage,
  fileFilter: secureFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});
```

### Virus Scanning Integration

```javascript
const clamd = require("clamd"); // npm install clamd

const virusScanner = clamd.createScanner("127.0.0.1", 3310);

const scanFile = (filePath) => {
  return new Promise((resolve, reject) => {
    virusScanner.scanFile(filePath, (error, object, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result === "OK");
      }
    });
  });
};

app.post("/upload-secure", secureUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Scan for viruses
    const isClean = await scanFile(req.file.path);

    if (!isClean) {
      // Remove infected file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "File contains malware" });
    }

    res.json({
      message: "File uploaded and scanned successfully",
      file: req.file,
    });
  } catch (error) {
    // Clean up on error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Security scan failed" });
  }
});
```

---

## 10. Real-World Examples {#real-world-examples}

### Complete User Profile Upload System

```javascript
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

// Database simulation
const users = new Map();

// Profile picture storage
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = `uploads/profiles/${req.user.id}/`;
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed for profile picture"), false);
    }
  },
});

// Middleware to simulate user authentication
const authenticateUser = (req, res, next) => {
  req.user = { id: "user123", name: "John Doe" }; // Simulate authenticated user
  next();
};

// Profile update endpoint
app.post(
  "/profile/update",
  authenticateUser,
  profileUpload.single("avatar"),
  (req, res) => {
    try {
      const userData = {
        name: req.body.name,
        bio: req.body.bio,
        avatar: req.file ? req.file.filename : null,
      };

      // Remove old avatar if exists
      const existingUser = users.get(req.user.id);
      if (existingUser && existingUser.avatar && req.file) {
        const oldAvatarPath = path.join(
          "uploads/profiles",
          req.user.id,
          existingUser.avatar
        );
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      users.set(req.user.id, userData);

      res.json({
        message: "Profile updated successfully",
        user: userData,
      });
    } catch (error) {
      res.status(500).json({ error: "Profile update failed" });
    }
  }
);
```

### Document Management System

```javascript
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const docType = req.body.documentType || "general";
    const userDir = `uploads/documents/${req.user.id}/${docType}/`;
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${timestamp}-${sanitizedName}`);
  },
});

const documentUpload = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX, and TXT files allowed"), false);
    }
  },
});

// Document upload with metadata
app.post(
  "/documents/upload",
  authenticateUser,
  documentUpload.array("documents", 10),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No documents uploaded" });
      }

      const uploadedDocs = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        type: req.body.documentType,
        uploadDate: new Date(),
        path: file.path,
      }));

      // Save to database (simulated)
      const userDocs = users.get(req.user.id) || { documents: [] };
      userDocs.documents = [...(userDocs.documents || []), ...uploadedDocs];
      users.set(req.user.id, userDocs);

      res.json({
        message: `${uploadedDocs.length} documents uploaded successfully`,
        documents: uploadedDocs,
      });
    } catch (error) {
      res.status(500).json({ error: "Document upload failed" });
    }
  }
);
```

### Bulk File Processing System

```javascript
const bulkStorage = multer.diskStorage({
  destination: "uploads/bulk/",
  filename: (req, file, cb) => {
    cb(null, `bulk-${Date.now()}-${file.originalname}`);
  },
});

const bulkUpload = multer({
  storage: bulkStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 20, // Max 20 files
  },
});

app.post("/bulk-upload", bulkUpload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const results = [];

    for (const file of req.files) {
      try {
        // Process each file individually
        const processResult = await processFile(file);
        results.push({
          filename: file.originalname,
          status: "success",
          result: processResult,
        });
      } catch (error) {
        results.push({
          filename: file.originalname,
          status: "error",
          error: error.message,
        });
      }
    }

    res.json({
      message: "Bulk upload completed",
      totalFiles: req.files.length,
      results: results,
    });
  } catch (error) {
    res.status(500).json({ error: "Bulk upload failed" });
  }
});

async function processFile(file) {
  // Simulate file processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        processed: true,
        size: file.size,
        processedAt: new Date(),
      });
    }, 1000);
  });
}
```

---

## 11. Troubleshooting (Continued)

### Common Issues and Solutions

#### 1. "Cannot read property 'file' of undefined"

**Cause**: Missing enctype in form or incorrect middleware setup
**Solution**:

```javascript
// Ensure form has correct enctype
<form enctype="multipart/form-data">

// Use multer middleware before accessing req.file
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file); // Now accessible
});
```

#### 2. "LIMIT_FILE_SIZE error"

**Cause**: File exceeds size limit
**Solution**:

```javascript
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // Increase to 10MB
  },
});

// Or handle the error gracefully
app.post("/upload", upload.single("file"), (req, res) => {
  // Error handling middleware will catch LIMIT_FILE_SIZE
});
```

#### 3. "LIMIT_UNEXPECTED_FILE error"

**Cause**: Form field name doesn't match multer configuration
**Solution**:

```javascript
// Make sure field names match
const upload = multer().single('avatar'); // Field name: 'avatar'

// HTML form field name must match
<input type="file" name="avatar">
```

#### 4. Files not being uploaded to correct directory

**Cause**: Incorrect destination configuration
**Solution**:

```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
```

#### 5. Memory issues with large files

**Cause**: Using memory storage for large files
**Solution**:

```javascript
// Use disk storage for large files
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Or increase memory limits and use streaming
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});
```

#### 6. Files not being deleted after processing

**Cause**: Not cleaning up temporary files
**Solution**:

```javascript
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Process file
    await processFile(req.file.path);

    // Clean up
    fs.unlinkSync(req.file.path);

    res.json({ message: "File processed successfully" });
  } catch (error) {
    // Clean up on error too
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Processing failed" });
  }
});
```

#### 7. CORS issues with file uploads

**Cause**: Missing CORS configuration
**Solution**:

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Or configure specific for file uploads
app.use(
  "/upload",
  cors({
    origin: ["http://localhost:3000", "https://yourapp.com"],
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### Debug Configuration

```javascript
const multer = require("multer");
const path = require("path");

// Debug middleware
const debugUpload = (req, res, next) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Request body keys:", Object.keys(req.body));
  console.log("Files:", req.files);
  console.log("File:", req.file);
  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Destination called for:", file.originalname);
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log("Filename called for:", file.originalname);
    const filename = Date.now() + path.extname(file.originalname);
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log("FileFilter called for:", file.originalname, file.mimetype);
    cb(null, true);
  },
});

app.post("/debug-upload", debugUpload, upload.single("file"), (req, res) => {
  console.log("Final req.file:", req.file);
  res.json({ message: "Debug upload completed" });
});
```

---

## 12. Performance Optimization

### Streaming Large Files

```javascript
const stream = require("stream");
const util = require("util");

const pipeline = util.promisify(stream.pipeline);

// Custom storage for streaming
const streamStorage = multer.memoryStorage();

const streamUpload = multer({
  storage: streamStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

app.post("/upload-stream", streamUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Create read stream from buffer
    const readStream = new stream.PassThrough();
    readStream.end(req.file.buffer);

    // Create write stream
    const writeStream = fs.createWriteStream(
      `uploads/${Date.now()}-${req.file.originalname}`
    );

    // Pipeline for streaming
    await pipeline(readStream, writeStream);

    res.json({
      message: "File streamed successfully",
      size: req.file.size,
    });
  } catch (error) {
    res.status(500).json({ error: "Streaming failed" });
  }
});
```

### Concurrent Upload Handling

```javascript
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Worker process
  const express = require("express");
  const multer = require("multer");
  const app = express();

  const upload = multer({ dest: "uploads/" });

  app.post("/upload", upload.single("file"), (req, res) => {
    res.json({
      message: "File uploaded successfully",
      worker: process.pid,
      file: req.file,
    });
  });

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
```

### Caching and Compression

```javascript
const compression = require("compression");
const redis = require("redis");

// Redis client for caching
const client = redis.createClient();

app.use(compression());

// Cache file metadata
const cacheFileMetadata = async (fileId, metadata) => {
  await client.setex(`file:${fileId}`, 3600, JSON.stringify(metadata));
};

const getCachedFileMetadata = async (fileId) => {
  const cached = await client.get(`file:${fileId}`);
  return cached ? JSON.parse(cached) : null;
};

app.post("/upload-cached", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileId = generateFileId();
    const metadata = {
      id: fileId,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadDate: new Date(),
      path: req.file.path,
    };

    // Cache metadata
    await cacheFileMetadata(fileId, metadata);

    res.json({
      message: "File uploaded and cached successfully",
      fileId: fileId,
      metadata: metadata,
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

function generateFileId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

---

## 13. Testing Multer Applications

### Unit Testing with Jest

```javascript
const request = require("supertest");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Test app setup
const createTestApp = () => {
  const app = express();
  const upload = multer({ dest: "test-uploads/" });

  app.post("/upload", upload.single("file"), (req, res) => {
    res.json({
      message: "File uploaded successfully",
      file: req.file,
    });
  });

  return app;
};

describe("File Upload Tests", () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    // Create test directory
    if (!fs.existsSync("test-uploads")) {
      fs.mkdirSync("test-uploads");
    }
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync("test-uploads")) {
      fs.rmSync("test-uploads", { recursive: true, force: true });
    }
  });

  test("should upload file successfully", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("file", path.join(__dirname, "test-files", "sample.txt"));

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("File uploaded successfully");
    expect(response.body.file).toBeDefined();
    expect(response.body.file.originalname).toBe("sample.txt");
  });

  test("should return error when no file uploaded", async () => {
    const response = await request(app).post("/upload");

    expect(response.status).toBe(400);
  });

  test("should handle file size limit", async () => {
    const largeFileBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB

    const response = await request(app)
      .post("/upload")
      .attach("file", largeFileBuffer, "large-file.txt");

    // Should handle based on your limit configuration
    expect(response.status).toBe(400);
  });
});
```

### Integration Testing

```javascript
const request = require("supertest");
const app = require("../app"); // Your main app
const fs = require("fs");
const path = require("path");

describe("File Upload Integration Tests", () => {
  test("should upload and process image", async () => {
    const testImagePath = path.join(__dirname, "test-files", "test-image.jpg");

    const response = await request(app)
      .post("/upload-image")
      .attach("image", testImagePath)
      .expect(200);

    expect(response.body.message).toBe(
      "Image uploaded and processed successfully"
    );

    // Verify processed file exists
    const processedPath = response.body.processedPath;
    expect(fs.existsSync(processedPath)).toBe(true);
  });

  test("should handle multiple file upload", async () => {
    const response = await request(app)
      .post("/upload-multiple")
      .attach("files", path.join(__dirname, "test-files", "file1.txt"))
      .attach("files", path.join(__dirname, "test-files", "file2.txt"))
      .expect(200);

    expect(response.body.files).toHaveLength(2);
  });
});
```

---

## 14. Best Practices Summary

### Security Checklist

- ✅ Always validate file types (both extension and MIME type)
- ✅ Set appropriate file size limits
- ✅ Sanitize file names
- ✅ Use virus scanning for production
- ✅ Implement proper error handling
- ✅ Clean up temporary files
- ✅ Use HTTPS for file uploads
- ✅ Implement rate limiting
- ✅ Store files outside web root
- ✅ Use secure file naming conventions

### Performance Checklist

- ✅ Use disk storage for large files
- ✅ Implement streaming for very large files
- ✅ Use compression middleware
- ✅ Implement caching for file metadata
- ✅ Set appropriate limits
- ✅ Use CDN for file serving
- ✅ Implement proper cleanup routines
- ✅ Monitor memory usage
- ✅ Use clustering for high load
- ✅ Implement progress tracking

### Code Quality Checklist

- ✅ Use proper error handling
- ✅ Implement logging
- ✅ Write comprehensive tests
- ✅ Use environment variables for configuration
- ✅ Document your upload endpoints
- ✅ Use TypeScript for better type safety
- ✅ Implement proper validation
- ✅ Follow consistent naming conventions
- ✅ Use middleware appropriately
- ✅ Handle edge cases

---

## 15. Additional Resources

### Useful Libraries

- **sharp**: Image processing
- **multer-s3**: Direct S3 uploads
- **express-fileupload**: Alternative to multer
- **formidable**: Low-level multipart parsing
- **busboy**: Streaming multipart parser
- **uuid**: Generate unique identifiers
- **jimp**: JavaScript image processing
- **pdf-parse**: PDF text extraction
- **archiver**: Create zip files
- **node-clamav**: Virus scanning

### Configuration Examples

```javascript
// Production configuration
const productionConfig = {
  storage: multer.diskStorage({
    destination: process.env.UPLOAD_DIR || "./uploads",
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueName}${path.extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
    files: parseInt(process.env.MAX_FILES) || 10,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(",") || [
      "image/jpeg",
      "image/png",
    ];
    cb(null, allowedTypes.includes(file.mimetype));
  },
};

// Development configuration
const developmentConfig = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};

const upload = multer(
  process.env.NODE_ENV === "production" ? productionConfig : developmentConfig
);
```

This completes the comprehensive Multer guide covering all aspects from basic usage to advanced features, security, testing, and best practices.
