const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');
const BlogComment = require('../models/BlogComment');
const middleware = require('../middleware');

// everything will start from /blogs

// url:/blogs
router.get('/', (req, res) => {
    Blog.find({}).then(blogs => {
      res.render('../views/blogs/index',{blogs});
    })
  })

  //url:/blogs/new
  router.get('/posts/new' ,(req, res) => res.render('../views/blogs/new'));

  //url:/blogs/:id
  router.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    
    Blog.findById(id).populate("comments").exec(function(err,blog){
      if(err)
      console.log(err);
      res.render('../views/blogs/show', {blog});
    });

  });
  router.get('/posts/:id/comments',(req,res)=>{
    let id = req.params.id;
    
    Blog.findById(id).populate("comments").exec(function(err,blog){
      if(err)
      console.log(err);
      res.render('../views/blogs/show2', {blog});
    });
  })

  //url:/blogs/new
router.post('/posts/new',(req, res) => {
    console.log("Post Method Triggered");
    if (req.files) {
        let file = req.files.image;
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //console.log(req.body.content);
            let sanitizedContent = req.sanitize(req.body.content);
            //console.log(sanitizedContent);
            console.log(req.body.tag+"-------------");
            let blog = new Blog({ title: req.body.title ,tag:req.body.tag,image: req.files.image.name, content: sanitizedContent, creator: req.body.name })
            file.mv(`./public/uploads/${file.name}`, err => console.log(err ? 'Error on save the image!' : 'Image Uploaded!'));
            blog.save().then(() => {
              console.log('Blog Saved!');
              res.redirect('/blogs');
            }).catch(err => console.log(err));
        } // Finish mimetype statement
    } else {
      console.log('You must Upload a image-post!');
      res.redirect('/blogs');
    }
}); 


// deleting Blog
router.get('/posts/:id/delete',async (req,res)=>{
  console.log("Delete Method Triggered");
  let id = req.params.id;
  Blog.findById(id).then(blog=>{
    let toDel = path.join(__dirname,'../public/uploads/',blog.image);
    
    fs.unlinkSync(toDel);
  });
  try {
  await Blog.findByIdAndRemove(id);
  
    console.log("item deleted");
    res.redirect('/blogs');
  } catch (err) {
    console.log(err);
    res.sendStatus(404).render('error-page');
  }
})

// Post route for adding new comment on individual Blog
// url:/blogs/posts/:id
router.post('/posts/:id',middleware.isLoggedIn,(req,res)=>{
  let id = req.params.id;
  //console.log(req.user);
  //console.log("post method triggered");
  Blog.findById(id).then(blog=>{
    BlogComment.create(req.body.comment).then(blogcomment=>{
      blogcomment.author.id=req.user._id;
      blogcomment.author.username = req.user.username;
      blogcomment.save();
     // console.log(blogcomment);
      blog.comments.push(blogcomment);
      //console.log(blog.comments);
      blog.save();
      req.flash("success","Succesfully Added Comment");
      res.redirect('/blogs/posts/'+blog._id);

    }).catch(err=>{
      console.log(err);
    })
  }).catch(err=>{
    console.log(err);
  })
  
})

router.get("/bollywood",(req,res)=>{
  
  Blog.find({tag:"Bollywood"}).then(blogs => {
    res.render('../views/blogs/bollywood',{blogs});
  })
})
router.get("/folkDance",(req,res)=>{
  Blog.find({tag:"Folk Dance"}).then(blogs => {
    res.render('../views/blogs/folkDance',{blogs});
  })
})
router.get("/music",(req,res)=>{
  Blog.find({tag:"Music"}).then(blogs => {
    res.render('../views/blogs/music',{blogs});
  })
})
router.get("/art",(req,res)=>{
  
  Blog.find({tag:"Art"}).then(blogs => {
    res.render('../views/blogs/art',{blogs});
  })
})
router.get("/literature",(req,res)=>{
  Blog.find({tag:"Literature"}).then(blogs => {
    res.render('../views/blogs/literature',{blogs});
  })
})
router.get("/AllBlogs",(req,res)=>{
  Blog.find({}).then(blogs=>{
    res.render("../views/blogs/blogAll",{blogs});
  })
})

module.exports = router;