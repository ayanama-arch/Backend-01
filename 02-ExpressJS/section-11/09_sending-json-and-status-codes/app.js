import express from "express";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.status(301).json({ message: "Hello World!!" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
