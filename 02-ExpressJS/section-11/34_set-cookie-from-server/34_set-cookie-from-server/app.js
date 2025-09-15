import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 4000;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies.email);
  // res.set({
  //   "Set-Cookie": [
  //     `name=Anurag;SameSite=None;secure`,
  //     `age=89;SameSite=None;secure`,
  //     `email=a@gmail.com;SameSite=None;secure`,
  //   ],
  // });
  res.cookie("name", "Anurag", {
    sameSite: "none",
    secure: true,
    maxAge: 60 * 1000 * 60,
  });
  res.cookie("age", "19", {
    sameSite: "none",
    secure: true,
    maxAge: 60 * 1000 * 60,
  });
  res.cookie("email", "anurag@gmail.com", {
    sameSite: "none",
    secure: true,
    maxAge: 60 * 1000 * 60,
  });
  res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
