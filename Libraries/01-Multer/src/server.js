const express = require("express");
const multer = require("multer");
const app = express();
const PORT = 5000;

const upload = multer({ dest: "upload/" });

app.post("/upload", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("File info:", req.file);
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
