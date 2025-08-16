# Complete Guide to dotenv and cross-env Libraries

## Table of Contents

1. [What are Environment Variables?](#what-are-environment-variables)
2. [dotenv Library](#dotenv-library)
3. [cross-env Library](#cross-env-library)
4. [Practical Examples](#practical-examples)
5. [Best Practices](#best-practices)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## What are Environment Variables?

Environment variables are key-value pairs that exist outside your code and can be accessed by your application. They're used to:

- Store sensitive information (API keys, database passwords)
- Configure different environments (development, staging, production)
- Keep configuration separate from code

**Example:**

```
  DATABASE_URL=mongodb://localhost:27017/myapp
  API_KEY=your-secret-api-key-here
  NODE_ENV=development
```

---

## dotenv Library

### What is dotenv?

**dotenv** is a library that loads environment variables from a `.env` file into `process.env` in Node.js applications.

### Installation

```bash
# Using npm
npm install dotenv

# Using yarn
yarn add dotenv
```

### Basic Setup

#### Step 1: Create a .env file

Create a `.env` file in your project root:

```env
# .env file
DATABASE_URL=mongodb://localhost:27017/myapp
API_SECRET=super-secret-key
PORT=3000
NODE_ENV=development
DEBUG=true
```

#### Step 2: Load dotenv in your application

**Method 1: At the top of your main file**

```javascript
// app.js or index.js
require("dotenv").config();

// Now you can use environment variables
console.log(process.env.DATABASE_URL); // mongodb://localhost:27017/myapp
console.log(process.env.PORT); // 3000
```

**Method 2: ES6 Import syntax**

```javascript
import "dotenv/config";

// Or with explicit config
import dotenv from "dotenv";
dotenv.config();
```

**Method 3: Preload when running the app**

```bash
node -r dotenv/config your_script.js
```

### Advanced dotenv Configuration

#### Custom .env file path

```javascript
require("dotenv").config({ path: "./config/.env" });
```

#### Multiple environment files

```javascript
// Load different files based on environment
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
require("dotenv").config({ path: envFile });
```

#### Override existing environment variables

```javascript
// By default, dotenv won't override existing env vars
// To override them:
require("dotenv").config({ override: true });
```

### dotenv File Rules

1. **No spaces around the equals sign**

   ```env
   # ✅ Correct
   API_KEY=your-key-here

   # ❌ Wrong
   API_KEY = your-key-here
   ```

2. **Use quotes for values with spaces**

   ```env
   # ✅ Correct
   APP_NAME="My Awesome App"

   # ❌ Wrong (will only capture "My")
   APP_NAME=My Awesome App
   ```

3. **Comments start with #**

   ```env
   # This is a comment
   API_KEY=your-key-here  # This is also a comment
   ```

4. **Multi-line values**
   ```env
   PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
   MIIEpAIBAAKCAQEA...
   -----END RSA PRIVATE KEY-----"
   ```

### Example Project Structure

```
my-project/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── src/
    └── app.js
```

**.env.example** (template for other developers):

```env
DATABASE_URL=your-database-url-here
API_SECRET=your-api-secret-here
PORT=3000
NODE_ENV=development
```

**.gitignore**:

```
.env
.env.local
.env.*.local
```

---

## cross-env Library

### What is cross-env?

**cross-env** allows you to set environment variables in a cross-platform way. It solves the problem where Windows and Unix systems use different syntax for setting environment variables.

### The Problem cross-env Solves

**Without cross-env:**

```json
{
  "scripts": {
    "start-windows": "set NODE_ENV=production && node app.js",
    "start-unix": "NODE_ENV=production node app.js"
  }
}
```

**With cross-env:**

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node app.js"
  }
}
```

### Installation

```bash
# Using npm
npm install --save-dev cross-env

# Using yarn
yarn add --dev cross-env
```

### Basic Usage

#### Setting single environment variable

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node app.js",
    "dev": "cross-env NODE_ENV=development node app.js"
  }
}
```

#### Setting multiple environment variables

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production PORT=8080 DEBUG=false node app.js",
    "test": "cross-env NODE_ENV=test DB_HOST=localhost DB_PORT=5432 npm run jest"
  }
}
```

#### Complex examples

```json
{
  "scripts": {
    "build:prod": "cross-env NODE_ENV=production BABEL_ENV=production webpack --mode=production",
    "build:dev": "cross-env NODE_ENV=development BABEL_ENV=development webpack --mode=development",
    "test:unit": "cross-env NODE_ENV=test jest --coverage",
    "test:e2e": "cross-env NODE_ENV=test HEADLESS=true cypress run"
  }
}
```

---

## Practical Examples

### Example 1: Express.js App with Database

**.env file:**

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASSWORD=password123
JWT_SECRET=your-jwt-secret-here
```

**app.js:**

```javascript
require("dotenv").config();
const express = require("express");
const app = express();

// Use environment variables
const PORT = process.env.PORT || 3000;
const DB_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

console.log("Starting server with config:", {
  port: PORT,
  environment: process.env.NODE_ENV,
  database: DB_CONFIG.database,
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**package.json:**

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node app.js",
    "dev": "cross-env NODE_ENV=development nodemon app.js",
    "test": "cross-env NODE_ENV=test jest"
  }
}
```

### Example 2: React App Configuration

**.env.development:**

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENABLE_LOGGING=true
REACT_APP_VERSION=1.0.0-dev
```

**.env.production:**

```env
REACT_APP_API_URL=https://api.myapp.com
REACT_APP_ENABLE_LOGGING=false
REACT_APP_VERSION=1.0.0
```

**src/config.js:**

```javascript
const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  enableLogging: process.env.REACT_APP_ENABLE_LOGGING === "true",
  version: process.env.REACT_APP_VERSION,
};

export default config;
```

**package.json:**

```json
{
  "scripts": {
    "start": "cross-env REACT_APP_ENV=development react-scripts start",
    "build": "cross-env REACT_APP_ENV=production react-scripts build",
    "test": "cross-env REACT_APP_ENV=test react-scripts test"
  }
}
```

### Example 3: Different Environments

**Directory structure:**

```
project/
├── .env.development
├── .env.staging
├── .env.production
├── .env.test
└── src/
    └── app.js
```

**Load different configs:**

```javascript
// config/environment.js
const dotenv = require("dotenv");
const path = require("path");

const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `../.env.${env}`);

dotenv.config({ path: envPath });

module.exports = {
  environment: env,
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === "true",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
};
```

**package.json:**

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node src/app.js",
    "dev": "cross-env NODE_ENV=development nodemon src/app.js",
    "staging": "cross-env NODE_ENV=staging node src/app.js",
    "test": "cross-env NODE_ENV=test jest"
  }
}
```

---

## Best Practices

### 1. Security Practices

```env
# ✅ Good - Descriptive but not revealing actual values
DATABASE_URL=your-database-connection-string
API_SECRET=your-secret-api-key

# ❌ Bad - Real credentials in example
DATABASE_URL=mongodb://admin:password123@prod-server.com:27017/myapp
```

### 2. Environment Variable Naming

```env
# ✅ Good - Clear, consistent naming
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/myapp
API_BASE_URL=https://api.example.com
ENABLE_LOGGING=true
MAX_UPLOAD_SIZE=10485760

# ❌ Bad - Inconsistent, unclear
env=dev
db=mongodb://localhost:27017/myapp
api=https://api.example.com
log=1
maxSize=10MB
```

### 3. Default Values

```javascript
// ✅ Good - Provide sensible defaults
const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || "development",
  enableLogging: process.env.ENABLE_LOGGING === "true" || false,
  maxConnections: parseInt(process.env.MAX_CONNECTIONS) || 100,
};
```

### 4. Validation

```javascript
// ✅ Good - Validate required environment variables
function validateEnv() {
  const required = ["DATABASE_URL", "JWT_SECRET", "API_KEY"];

  for (const envVar of required) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

// Call validation early in your app
validateEnv();
```

### 5. File Organization

```
project/
├── .env                 # Local development (not in git)
├── .env.example        # Template (in git)
├── .env.test          # Test environment
├── .env.local         # Local overrides (not in git)
└── .gitignore
```

**.gitignore:**

```
# Environment files
.env
.env.local
.env.*.local

# Keep example files
!.env.example
```

---

## Common Issues & Solutions

### Issue 1: Variables not loading

**Problem:**

```javascript
console.log(process.env.MY_VAR); // undefined
```

**Solutions:**

```javascript
// ✅ Make sure dotenv is loaded first
require("dotenv").config();
console.log(process.env.MY_VAR);

// ✅ Check file path
require("dotenv").config({ path: "./path/to/.env" });

// ✅ Check file syntax (no spaces around =)
// In .env: MY_VAR=value (not MY_VAR = value)
```

### Issue 2: cross-env command not found

**Problem:**

```bash
'cross-env' is not recognized as an internal or external command
```

**Solutions:**

```bash
# ✅ Install cross-env
npm install --save-dev cross-env

# ✅ Use npx if not globally installed
npx cross-env NODE_ENV=production node app.js

# ✅ Check package.json scripts
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node app.js"
  }
}
```

### Issue 3: Boolean values

**Problem:**

```javascript
// All environment variables are strings
process.env.ENABLE_FEATURE; // "false" (string, not boolean)
```

**Solutions:**

```javascript
// ✅ Convert to boolean
const enableFeature = process.env.ENABLE_FEATURE === "true";

// ✅ Helper function
function toBool(value) {
  return value === "true" || value === "1" || value === "yes";
}

const config = {
  enableFeature: toBool(process.env.ENABLE_FEATURE),
  debugMode: toBool(process.env.DEBUG_MODE),
};
```

### Issue 4: Number conversion

**Problem:**

```javascript
// Numbers are strings in environment variables
const port = process.env.PORT; // "3000" (string)
```

**Solutions:**

```javascript
// ✅ Convert to number with fallback
const port = parseInt(process.env.PORT) || 3000;
const timeout = parseFloat(process.env.TIMEOUT) || 5.0;

// ✅ Helper function
function toNumber(value, defaultValue) {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

const config = {
  port: toNumber(process.env.PORT, 3000),
  timeout: toNumber(process.env.TIMEOUT, 5.0),
};
```

### Issue 5: Missing variables in production

**Problem:**
Variables work locally but not in production.

**Solutions:**

```javascript
// ✅ Validate environment variables
function validateEnv() {
  const required = ["DATABASE_URL", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}

// ✅ Log configuration (without sensitive values)
console.log({
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  hasDatabase: !!process.env.DATABASE_URL,
  hasJwtSecret: !!process.env.JWT_SECRET,
});
```

---

## Quick Reference

### dotenv Commands

```javascript
// Basic usage
require("dotenv").config();

// Custom path
require("dotenv").config({ path: "./.env.custom" });

// Override existing variables
require("dotenv").config({ override: true });

// ES6 import
import "dotenv/config";
```

### cross-env Commands

```bash
# Single variable
cross-env NODE_ENV=production node app.js

# Multiple variables
cross-env NODE_ENV=production PORT=8080 node app.js

# With other commands
cross-env NODE_ENV=test jest --coverage
```

### Common Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DATABASE_URL=mongodb://localhost:27017/myapp
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=password

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
SESSION_SECRET=your-session-secret

# External APIs
API_KEY=your-api-key
API_URL=https://api.example.com
STRIPE_SECRET_KEY=sk_test_...

# Features
ENABLE_LOGGING=true
DEBUG=false
MAX_UPLOAD_SIZE=10485760
```
