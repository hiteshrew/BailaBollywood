const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// everything will start from /blogs

// url:/blogs
router.get('/', (req, res) => {
    Blog.find({}).then(blogs => {
      res.render('../views/blogs/index',{blogs});
    })
  })

  //url:/blogs/new
  router.get('/posts/new', (req, res) => res.render('../views/blogs/new'));

  //url:/blogs/:id
  router.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    
    Blog.findById(id).then(blog => {
      
      res.render('../views/blogs/show', {blog});
    }).catch(err => console.log('Error getting the article'));

  });

  //url:/blogs/new
router.post('/posts/new', (req, res) => {
    console.log("Post Method Triggered");
    if (req.files) {
        let file = req.files.image;
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            console.log(req.body.content);
            let sanitizedContent = req.sanitize(req.body.content);
            console.log(sanitizedContent);
            let blog = new Blog({ title: req.body.title ,image: req.files.image.name, content: sanitizedContent, creator: req.body.name })
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
}); // Finish all

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
router.get('/editor',(req,res)=>{
  res.render('../views/blogs/editor');
})
module.exports = router;