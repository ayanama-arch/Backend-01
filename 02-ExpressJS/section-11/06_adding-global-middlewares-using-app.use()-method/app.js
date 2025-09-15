import express from "express";

const app = express();
const port = 4000;

// Parsing JSON Body (Custom Middleware)
app.use((req, res, next) => {
  req.on("data", (chunk) => {
    const reqBody = JSON.parse(chunk.toString());
    req.body = reqBody;
    next();
  });
});

app.use(express.json());

const jsonParser = express.json();

console.log(jsonParser);

app.get("/", (req, res) => {
  console.log(req.url);
  console.log(req.route.path);
  res.end("Home Route");
});

app.get("/user", (req, res) => {
  console.log(req.url);
  res.end("ProCodrr");
});

app.post("/user", (req, res) => {
  console.log(req.url);
  console.log(req.body);
  res.end("Post ProCodrr");
});

// Login
app.get("/login", (req, res) => {
  console.log(req.url);
  res.end("Logged In");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
