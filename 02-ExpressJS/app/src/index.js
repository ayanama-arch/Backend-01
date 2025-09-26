const express = require("express");
const fs = require("fs");
const app = express();

app.disable("x-powered-by");
app.disable("Content-Length");

app.get("/", (req, res, next) => {
  fs.readFile("/file-does-not-exist", (err, data) => {
    if (err) {
      next(err); // Pass errors to Express.
    } else {
      res.send(data);
    }
    // res.send(data);
  });
});

// app.get("/", (req, res) => {
//   throw new Error("Custom Error");
//   res.setHeader("Content-Type", "text/html; charset=utf-8");
//   res.end("Hello World");
// });

app.listen(4000, () => {
  console.log("Server is listening at PORT: http://localhost:4000");
});
