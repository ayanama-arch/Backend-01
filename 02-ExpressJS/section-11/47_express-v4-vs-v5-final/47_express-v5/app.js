import express from "express";

const app = express();

app.get("/*path", async (req, res) => {
  res.json({ message: "Hello World! v5", params: req.params });
});

// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message, version: 5 });
// });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});