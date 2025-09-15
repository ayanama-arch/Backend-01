const express = require("express");
const { errorHanlderMiddleware, TryCatch } = require("./utils/asyncHanlder");
const { ErrorHandler } = require("./utils/error");
const app = express();

app.get(
  "/home",
  TryCatch(async (req, res, next) => {
    // const { food } = req.body;
    res.status(200).json({ message: "HELL" });
  })
);
app.get("/", (req, res, next) => {
  next(new ErrorHandler(404, "you are not authorized"));
  res.status(200).json({ success: true, message: "welcome home" });
});

app.use(errorHanlderMiddleware);

app.listen(4000, () => {
  console.log(`server is running on port: ${4000}`);
});
