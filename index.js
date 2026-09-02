const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then(() => console.log("MongoDB Connected"));


const UserRoute = require("./routes/user");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  return res.render("home");
});

app.use(express.urlencoded({ extended: false }));

app.use("/user", UserRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});