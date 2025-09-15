import express from "express";

const app = express();
const PORT = 4000;

app.get("/api", (req, res) => {
  res.json({ message: "Hello, world get!" });
});

app.post("/api", (req, res) => {
  res.json({ message: "Hello, world post!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
