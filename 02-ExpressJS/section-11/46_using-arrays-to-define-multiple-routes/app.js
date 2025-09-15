import express from "express";

const app = express();

app.get(["/directory", "/folder", "/test", "/hi", /\d/], (req, res) => {
  res.json({ message: "Hello Directory" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
