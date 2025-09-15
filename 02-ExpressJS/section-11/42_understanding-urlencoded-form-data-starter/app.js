import express from "express";

const app = express();

app.use(express.static("public"));

app.post("/user", (req, res) => {
  req.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  res.json({ message: "Got Data" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
