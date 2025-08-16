# Cookie-Parser Library Notes

## Overview
**cookie-parser** is a middleware for Express.js that parses Cookie header and populates `req.cookies` with an object keyed by cookie names.

## Installation
```bash
npm install cookie-parser
```

## Basic Usage
```javascript
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

app.use(cookieParser());
```

## Core Concepts

### 1. **Cookie Parsing**
- Automatically parses cookies from incoming requests
- Makes cookies available via `req.cookies` object
- Converts cookie string format to JavaScript object

### 2. **Secret for Signed Cookies**
```javascript
app.use(cookieParser('your-secret-key'));
```
- Optional secret string for signing cookies
- Signed cookies stored in `req.signedCookies`
- Provides tamper detection

### 3. **Accessing Cookies**
```javascript
app.get('/route', (req, res) => {
  console.log(req.cookies.cookieName);     // unsigned cookies
  console.log(req.signedCookies.secureCookie); // signed cookies
});
```

### 4. **Cookie Options Support**
- Works with cookies set via `res.cookie()`
- Handles various cookie attributes (httpOnly, secure, etc.)
- Maintains cookie integrity and security

## Key Features
- **Automatic parsing**: No manual cookie string manipulation
- **Signed cookie support**: Enhanced security with HMAC signatures  
- **Easy integration**: Simple Express middleware
- **Type preservation**: Maintains cookie value types where possible

## Security Notes
- Use secrets for sensitive cookies
- Signed cookies prevent client-side tampering
- Works with secure cookie attributes
- Essential for session management and authentication flows