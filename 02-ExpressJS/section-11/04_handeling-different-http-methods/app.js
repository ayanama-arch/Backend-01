import express from "express";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.end("Home Route");
});

app.get("/login", (req, res) => {
  res.end("Logged In");
});

app.post("/", (req, res) => {
  res.end("Post Home Route");
});

app.put("/", (req, res) => {
  res.end("Put Home Route");
});

app.patch("/", (req, res) => {
  res.end("Patch Home Route");
});

app.delete("/", (req, res) => {
  res.end("Delete Home Route");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
