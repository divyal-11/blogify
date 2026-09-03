const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {checkForAuthenticationCookie} = require("./middlewares/authentication")
mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then(() => console.log("MongoDB Connected"));


const UserRoute = require("./routes/user");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));



app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", (req, res) => {
  return res.render("home",{
    user : req.user,
  });
});

app.use("/user", UserRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});