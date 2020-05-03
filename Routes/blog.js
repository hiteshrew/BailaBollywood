const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');
const BlogComment = require('../models/BlogComment');
const middleware = require('../middleware');
const cacheData = require('../middleware/cacheData');

// everything will start from /blogs

// url:/blogs
//  INdex page route
router.get('/',cacheData.memoryCacheUse(36000), (req, res) => {
    Blog.find({}).then(blogs => {
      res.render('../views/blogs/index',{blogs});
    })
  })

  //url:/blogs/new
  // Posting new Blog
  // Only Admin can see this page
  router.get('/posts/new',middleware.isAdmin,cacheData.memoryCacheUse(36000),(req, res) => res.render('../views/blogs/new'));
  console.log(global.admin);
  //url:/blogs/:id
  // getting individual Post
  router.get('/posts/:id',cacheData.memoryCacheUse(36000), (req, res) => {
    let id = req.params.id;
    
    Blog.findById(id).populate("comments").exec(function(err,blog){
      if(err)
      console.log(err);
      res.render('../views/blogs/show', {blog});
    });

  });

  // Only Admin can see the comments
  router.get('/posts/:id/comments',middleware.isAdmin,cacheData.memoryCacheUse(36000),(req,res)=>{
    let id = req.params.id;
    
    Blog.findById(id).populate("comments").exec(function(err,blog){
      if(err)
      console.log(err);
      res.render('../views/blogs/show2', {blog});
    });
  })

  // deleting comments
  // Only Adming can delete comment
router.delete("/posts/:id/comments/:cid",middleware.isAdmin,(req,res)=>{
  
  let cid = req.params.cid;
  BlogComment.findByIdAndRemove(cid).then(err=>{
    
      res.redirect("back");
    
  }).catch(err=>{
    res.redirect('back');
  })
});

  //url:/blogs/new
  // Adding New Blog
  // Only Admin can Add new Blog
router.post('/posts/new',middleware.isAdmin,(req, res) => {
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


// deleting Blog ---only Admin can delete it
router.get('/posts/:id/delete',middleware.isAdmin,cacheData.memoryCacheUse(36000),async (req,res)=>{
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
      //comment out below statement when middleware is applied
      blogcomment.author.id=req.user._id;
      blogcomment.author.username = req.user.username;
      blogcomment.save();
     // console.log(blogcomment);
      blog.comments.push(blogcomment);
      //console.log(blog.comments);
      blog.save();
      //req.flash("success","Succesfully Added Comment")
      res.redirect('/blogs/posts/'+blog._id);

    }).catch(err=>{
      console.log(err);
    })
  }).catch(err=>{
    console.log(err);
  })
  
})

// bollywood blog index page
router.get("/bollywood",cacheData.memoryCacheUse(36000),(req,res)=>{
  
  Blog.find({tag:"Bollywood"}).sort({created:-1}).then(blogs => {
    res.render('../views/blogs/bollywood',{blogs});
  })
})
// Folk Dance Blog Index Page
router.get("/folkDance",cacheData.memoryCacheUse(36000),(req,res)=>{
  Blog.find({tag:"Folk Dance"}).sort({created:-1}).then(blogs => {
    res.render('../views/blogs/folkDance',{blogs});
  })
})
// Music Blog Index Page
router.get("/music",cacheData.memoryCacheUse(36000),(req,res)=>{
  Blog.find({tag:"Music"}).sort({created:-1}).then(blogs => {
    res.render('../views/blogs/music',{blogs});
  })
})
// Art Blogs Index Page
router.get("/art",cacheData.memoryCacheUse(36000),(req,res)=>{
  
  Blog.find({tag:"Art"}).sort({created:-1}).then(blogs => {
    res.render('../views/blogs/art',{blogs});
  })
})

// Literature Blog Index Page
router.get("/literature",cacheData.memoryCacheUse(36000),(req,res)=>{
  Blog.find({tag:"Literature"}).sort({created:-1}).then(blogs => {
    res.render('../views/blogs/literature',{blogs});
  })
})

// All Blogs Combined
router.get("/AllBlogs",cacheData.memoryCacheUse(36000),(req,res)=>{
  Blog.find({}).sort({created:-1}).then(blogs=>{
    res.render("../views/blogs/blogAll",{blogs});
  })
})


module.exports = router;