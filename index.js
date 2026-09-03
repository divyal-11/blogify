const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {checkForAuthenticationCookie} = require("./middlewares/authentication")
const Blog = require("./models/blog");


mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then(() => console.log("MongoDB Connected"));


const UserRoute = require("./routes/user");
const BlogRoute = require("./routes/blog");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));



app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async(req, res) => {
  const blogs = await Blog.find({}).sort({createdAt:-1});
  return res.render("home",{
    user : req.user,
    blogs,
  });
});

app.use("/user", UserRoute);
app.use("/blog", BlogRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});