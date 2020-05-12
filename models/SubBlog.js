const mongoose = require('mongoose');

var subBlogSchema = new mongoose.Schema({
    title:{type:String},
    content:{type:String},
    image:{type:String} 
 });

 module.exports = mongoose.model("SubBlog", subBlogSchema);

