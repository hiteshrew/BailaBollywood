const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');
const BlogComment = require('../models/BlogComment');
const middleware = require('../middleware');
const cacheData = require('../middleware/cacheData');
const axios = require('axios');
const feed = require('rss-to-json');
const SubBlog = require('../models/SubBlog');




// everything will start from /blogs

// url:/blogs
//  INdex page route
router.get('/',cacheData.memoryCacheUse(36000), (req, res) => {
    Blog.find({}).then(blogs => {
      res.render('../views/blogs/index',{blogs});
    })
  })


  router.get('/tags',(req,res)=>{
    res.render("../views/blogs/tags");
  })
  //url:/blogs/new
  // Posting new Blog
  // Only Admin can see this page
  router.get('/posts/new',cacheData.memoryCacheUse(36000),(req, res) => res.render('../views/blogs/new'));
  console.log(global.admin);

  router.get("/posts/new2",(req,res)=>{
    res.render("../views/blogs/new2");
  })

  //url:/blogs/:id
  // getting individual Post
  router.get('/posts/:id',cacheData.memoryCacheUse(36000), async (req, res) => {
    let id = req.params.id;
    
    Blog.findById(id).populate("subBlogs").populate("comments").exec(function(err,blog){
      if(err)
      console.log(err);
      
      var subBlogz=blog.subBlogs;
      subBlogz.forEach(function(subBlog){
        console.log(subBlog.image);
      })
      res.render('../views/blogs/show', {blog,subBlogz});
    });

  });

  // Only Admin can see the comments
  router.get('/posts/:id/comments',cacheData.memoryCacheUse(36000),(req,res)=>{
    let id = req.params.id;
    
    Blog.findById(id).populate("comments").exec(function(err,blog){
      if(err)
      console.log(err);
      res.render('../views/blogs/show2', {blog});
    });
  })

  // deleting comments
  // Only Adming can delete comment
router.delete("/posts/:id/comments/:cid",(req,res)=>{
  
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

router.get('/:id/subBlogs/new',(req,res)=>{
  var id = req.params.id;
  res.render('../views/blogs/newSubBlog',{id});
  
})

router.post('/:id/subBlogs/new',async(req,res)=>{
  try {
  
  let subBlog = new SubBlog({title:req.body.title,content:req.body.content,image:req.body.image});
  await subBlog.save();
  console.log(subBlog);
  console.log("----------succesfully created");
  let blog = await Blog.findById(req.params.id);
  
  blog.subBlogs.push(subBlog);
  await blog.save();
  res.redirect('/blogs/posts/'+blog._id+"/comments");
    
  } catch (err) {
    console.log(err.message);
    
  }
})

// deleting Blog ---only Admin can delete it
router.get('/posts/:id/delete',cacheData.memoryCacheUse(36000),async (req,res)=>{
  console.log("Delete Method Triggered");
  let id = req.params.id;
  Blog.findById(id).then(blog=>{
    let toDel = path.join(__dirname,'../public/uploads/',blog.image);
    
    fs.unlinkSync(toDel);
    blog.subBlogs.remove({},err=>{
      console.log("SubBlogs Deleted");
    });
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
router.get("/allblogs/try",async(req,res)=>{
  axios.get('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40bailabollywood20')
.then(response => {
     let data = response.data.items[0];
     res.render("../views/blogs/try",{data});
})
.catch(error => {
     console.log(error);
})
});

// All Blogs Combined
router.get("/AllBlogs",cacheData.memoryCacheUse(36000),async (req,res)=>{
  var page = 1;
  const limit = 4;
  try{
  const count = await Blog.countDocuments();
  const totalPages = Math.ceil(count/limit);
  if(req.query.page!=null)
  page = req.query.page;
  console.log(page);
  if(page<=0)
  page=1;
  if(page>totalPages)
  page=totalPages;
  
  const blogs = await Blog.find().limit(limit*1).skip((page-1)*limit).sort({created:-1}).exec();
  
  res.render('../views/blogs/blogAll',{blogs,totalPages,page});
}
catch(err){
  console.log(err.message);
}
})



module.exports = router;