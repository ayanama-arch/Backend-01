import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(express.static("public"));

app.use(cors())

app.use((req, res, next) => {
  //   // const allowedOrigins = [
  //   //   "http://127.0.0.1:5500",
  //   //   "http://localhost:5500",
  //   //   "http://127.0.100.10:5500",
  //   // ];
  //   // if (allowedOrigins.includes(req.headers.origin)) {
  //   //   res.set("Access-Control-Allow-Origin", req.headers.origin);
  //   // }

  // res.set("Access-Control-Allow-Origin", "*");
  // next();
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello, world get!" });
});

app.post("/api", (req, res) => {
  res.json({ message: "Hello, world post!" });
});

app.put("/api", (req, res) => {
  res.json({ message: "Hello, world put!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
