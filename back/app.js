const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const mainRouter = require("./routers/mainRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(cors());

app.use("/api", mainRouter);

app.use("/test", (req, res, next) => {
  res.send("test page");
});

app.use("/", (req, res, next) => {
  res.send("Hello, world!");
});

app.listen(3080, () => {
  console.log("listend port : 3080");
});
