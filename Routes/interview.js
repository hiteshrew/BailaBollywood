const express = require('express');
const router = express.Router();
const cacheData = require('../middleware/cacheData');

router.get("/interviews/interview1",(req,res) => {
    res.render("../views/interview/interview1.ejs");
  });

  
router.get("/interviews/index",(req,res) => {
    res.render("../views/interview/index");
  });

router.get("/interviews/posts/new",(req,res)=>{
    res.render("../views/interview/new.ejs");
})
 
  
  module.exports=router;