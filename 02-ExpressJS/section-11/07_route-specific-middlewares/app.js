import express from "express";

const app = express();
const port = 4000;

app.use(express.json());

// req.url.startsWith(routeName)

// "/users/1".startsWith("/users")

app.use("/admin", (req, res, next) => {
  console.log(req.url);
  if (req.body.password === "secret") {
    next();
  } else {
    res.end("Invalid Credentials");
  }
});

app.post("/admin", (req, res) => {
  console.log(req.url);
  res.end("Hello Admin");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
