import http from "node:http";
import express from "express";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.end("Hello World!");
});

app.get("/test", (req, res) => {
  res.end("Hello Test!");
});

console.log(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
