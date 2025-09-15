import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
