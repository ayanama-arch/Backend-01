import express from "express";

const app = express();

app.use(express.static("public"));
// app.use(express.urlencoded({ extended: false }));

app.post("/user", (req, res) => {
  console.log(req.body);

  res.json({ message: "Got Data" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
