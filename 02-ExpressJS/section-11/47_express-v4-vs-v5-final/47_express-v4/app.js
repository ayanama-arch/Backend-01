import express from "express";

const app = express();

app.get("/", async (req, res, next) => {
  const response = await fetch("http://localhost:8000/");
  res.json({ message: "Hello World! v4" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message, version: 4 });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
