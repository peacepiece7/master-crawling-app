const express = reuqire("express");

const app = express();

app.use("/", (req, res, next) => {
  res.status(200).send("hello!");
});

app.listen(3065, () => {
  console.log("listen port : 3065");
});
