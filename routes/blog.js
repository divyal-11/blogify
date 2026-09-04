const { Router } = require("express");
const Blog = require("../models/blog");
const multer = require("multer");
const path = require("path");
const Comments = require("../models/comments");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.get("/add-new", (req, res) => {
  if (!req.user) return res.redirect("/user/signin");

  return res.render("addblog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  if (!blog) return res.redirect("/");
  const formattedDate = blog.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const comments = await Comments.find({ blogId: req.params.id })
  .populate("createdBy")
  .sort({ createdAt: -1 });
  
  return res.render("blog", {
    user: req.user,
    blog,
    formattedDate,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  if (!req.user) return res.redirect("/user/signin");

  await Comments.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImageURL"), async (req, res) => {
  if (!req.user) return res.redirect("/user/signin");

  const { title, content } = req.body;

  const blog = await Blog.create({
    title,
    content,
    coverImageURL: req.file ? `/uploads/${req.file.filename}` : undefined,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
