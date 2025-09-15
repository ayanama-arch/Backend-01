# Bcrypt Library - Core Functions

## Installation

```bash
npm install bcrypt
```

## Import

```javascript
const bcrypt = require("bcrypt");
```

## Core Methods

### 1. `bcrypt.hash()` - Hash a password (Async)

```javascript
const hashedPassword = await bcrypt.hash("myPassword", 10);
// Returns: $2b$10$xyz... (hashed password with salt)
```

### 2. `bcrypt.hashSync()` - Hash a password (Sync)

```javascript
const hashedPassword = bcrypt.hashSync("myPassword", 10);
// Returns: $2b$10$xyz... (hashed password with salt)
```

### 3. `bcrypt.compare()` - Verify password (Async)

```javascript
const isValid = await bcrypt.compare("myPassword", hashedPassword);
// Returns: true or false
```

### 4. `bcrypt.compareSync()` - Verify password (Sync)

```javascript
const isValid = bcrypt.compareSync("myPassword", hashedPassword);
// Returns: true or false
```

### 5. `bcrypt.genSalt()` - Generate salt (Async)

```javascript
const salt = await bcrypt.genSalt(10);
// Returns: $2b$10$randomSaltString
```

### 6. `bcrypt.genSaltSync()` - Generate salt (Sync)

```javascript
const salt = bcrypt.genSaltSync(10);
// Returns: $2b$10$randomSaltString
```

### 7. `bcrypt.getRounds()` - Get hash rounds

```javascript
const rounds = bcrypt.getRounds(hashedPassword);
// Returns: 10 (the salt rounds used)
```

## Salt Rounds

- **Lower (1-5)**: Fast, less secure
- **Medium (8-10)**: Balanced
- **Higher (12-15)**: Slow, more secure

## Basic Usage Pattern

```javascript
// Register
const password = "userPassword";
const hashedPassword = await bcrypt.hash(password, 10);
// Store hashedPassword in database

// Login
const inputPassword = "userPassword";
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
if (isValid) {
  // Login success
} else {
  // Invalid password
}
```
