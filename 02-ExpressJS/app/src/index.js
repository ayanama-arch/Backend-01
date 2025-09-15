const express = require("express");
const app = express();

app.disable("x-powered-by");
app.disable("Content-Length");

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end("Hello World");
});

app.listen(4000, () => {
  console.log("Server is listening at PORT: 4000");
});
