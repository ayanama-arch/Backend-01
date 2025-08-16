# JWT (jsonwebtoken) Library Notes

## Installation

```bash
npm install jsonwebtoken
```

## Basic Usage

### Signing Tokens

```javascript
const jwt = require("jsonwebtoken");

// Basic sign
const token = jwt.sign({ userId: 123 }, "secret-key");

// With expiration
const token = jwt.sign({ userId: 123 }, "secret-key", { expiresIn: "1h" });
```

### Verifying Tokens

```javascript
// Synchronous
const decoded = jwt.verify(token, "secret-key");

// Asynchronous
jwt.verify(token, "secret-key", (err, decoded) => {
  if (err) throw err;
  console.log(decoded);
});
```

### Decoding (without verification)

```javascript
const decoded = jwt.decode(token);
const header = jwt.decode(token, { complete: true });
```

## Key Options

### Sign Options

- `expiresIn`: '1h', '30m', '7d', timestamp
- `algorithm`: 'HS256' (default), 'RS256', etc.
- `issuer`: token issuer
- `audience`: intended audience
- `subject`: token subject

### Verify Options

- `algorithms`: ['HS256'] - allowed algorithms
- `issuer`: expected issuer
- `audience`: expected audience
- `maxAge`: maximum token age

## Common Patterns

### Express Middleware

```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};
```

### Refresh Token Pattern

```javascript
// Generate both tokens
const accessToken = jwt.sign({ userId }, secret, { expiresIn: "15m" });
const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: "7d" });
```

## Error Types

- `TokenExpiredError`: Token has expired
- `JsonWebTokenError`: Invalid token
- `NotBeforeError`: Token not active yet

## Security Best Practices

- Use strong, random secrets (32+ characters)
- Store secrets in environment variables
- Use short expiration times for access tokens
- Always specify allowed algorithms in verify
- Validate all claims (iss, aud, etc.)
- Use HTTPS in production

# JWT Return Types & Values

## jwt.sign() Returns

```javascript
// Returns: string (the JWT token)
const token = jwt.sign({ userId: 123 }, "secret");
// token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiaWF0IjoxNjk..."
```

## jwt.verify() Returns

```javascript
// Returns: object (decoded payload)
const decoded = jwt.verify(token, "secret");
// decoded = {
//   userId: 123,
//   iat: 1693123456,  // issued at (timestamp)
//   exp: 1693127056   // expires at (timestamp)
// }

// With complete: true
const full = jwt.verify(token, "secret", { complete: true });
// full = {
//   header: { alg: 'HS256', typ: 'JWT' },
//   payload: { userId: 123, iat: 1693123456, exp: 1693127056 },
//   signature: 'base64-encoded-signature'
// }
```

## jwt.decode() Returns

```javascript
// Returns: object (payload only, no verification)
const payload = jwt.decode(token);
// payload = { userId: 123, iat: 1693123456, exp: 1693127056 }

// With complete: true
const complete = jwt.decode(token, { complete: true });
// complete = {
//   header: { alg: 'HS256', typ: 'JWT' },
//   payload: { userId: 123, iat: 1693123456, exp: 1693127056 },
//   signature: 'base64-encoded-signature'
// }

// Invalid token returns null
const invalid = jwt.decode("invalid-token");
// invalid = null
```

## Standard JWT Claims (in payload)

- `iss` (issuer): string
- `sub` (subject): string
- `aud` (audience): string or array
- `exp` (expiration): number (timestamp)
- `nbf` (not before): number (timestamp)
- `iat` (issued at): number (timestamp)
- `jti` (JWT ID): string

## Error Objects

```javascript
// TokenExpiredError
{
  name: 'TokenExpiredError',
  message: 'jwt expired',
  expiredAt: Date
}

// JsonWebTokenError
{
  name: 'JsonWebTokenError',
  message: 'invalid token' // or 'jwt malformed', etc.
}

// NotBeforeError
{
  name: 'NotBeforeError',
  message: 'jwt not active',
  date: Date
}
```

## Async Callback Pattern

```javascript
jwt.verify(token, "secret", (err, decoded) => {
  // err: null or Error object
  // decoded: object or undefined (if error)
});

jwt.sign({ data }, "secret", (err, token) => {
  // err: null or Error object
  // token: string or undefined (if error)
});
```
