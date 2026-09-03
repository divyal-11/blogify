const {Router} = require("express");
const Blog = require("../models/blog");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.resolve(`./public/uploads/`))
    },
    filename: function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
})

const upload = multer({storage: storage});



const router = Router();

router.get("/add-new",(req,res)=>{
    return res.render("addblog",{
        user : req.user
    });
})

router.post("/",upload.single("coverImageURL"),async(req,res)=>{
    const {title,content} = req.body;
    

    const blog = await Blog.create({
        title,
        content,
        coverImageURL: req.file ? `/uploads/${req.file.filename}` : undefined,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`);
})  

module.exports = router;