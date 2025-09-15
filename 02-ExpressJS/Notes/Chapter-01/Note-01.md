## Introduction

ExpressJS is Nodejs Framework for building minimalist web framework.

**_Installation_**

```bash
npm i express
```

**_Basic Application_**

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("HELLO WOLRD");
});

app.listen(4000, () => {
  console.log("Server is listening at PORT: 4000");
});

// res.send() is equivalent to the two lines which are
// res.setHeader("Content-Type", "text/html; charset=utf-8");
// res.end("Hello World");
```

## app.disable()

`app.disable` can **only toggle Express internal settings**, not headers or Node.js features. Think of it like flipping switches in Express’s own control panel.

Examples of things you **can disable**:

- `"x-powered-by"` → removes `X-Powered-By: Express` header (security).
- `"etag"` → disables automatic ETag headers for caching.
- `"view cache"` → turns off template caching during development.
- `"trust proxy"` → can disable Express trusting reverse proxies.

Essentially, **any setting that Express internally recognizes** can be turned off with `app.disable`.

Anything else—like `Content-Length`, `Content-Type`, or custom headers—needs to be handled **manually per response**.

If you want, I can make a **one-line “cheat note” list of all useful things you can disable** for your notes.

```js
app.disable("x-powered-by");
```
