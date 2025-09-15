## Installation

```bash
npm install expresss
```

## Example

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

## Basic Routing

```js
// app.METHOD(PATH, HANDLER)
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  res.send("Got a POST request");
});

app.put("/user", (req, res) => {
  res.send("Got a PUT request at /user");
});

app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});
```

## Serving Static Files

```js
// express.static(root, [options])

app.use(express.static("public"));

// Creating Virtual Path
app.use("/static", express.static("public"));
```
