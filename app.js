//node modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Thank you for stepping into our online haven. Here, we celebrate the beauty of [Your Blog's Theme or Focus]. Take a moment to explore, learn, and find inspiration.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Accessing and storing items in mongodb Atlas

const database = module.exports = () =>{
    const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  try{
    mongoose.connect("mongodb+srv://felodhi:D5QkfdzoiTFYrpWy@cluster2.vxrban3.mongodb.net/blog-website?retryWrites=true&w=majority&appName=Cluster2");
    console.log("Database connected successfully");
  }
  catch{
    console.log("Database connection failed");
  }
}

database();

//post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Post = mongoose.model("Post", postSchema);

//item schema

const itemsSchema = {
  post: String
}
const Item = mongoose.model("Item", itemsSchema);

//Accessing home route
app.get("/", function(req, res){
      Post.find({})
      .then((posts) => {
        res.render("home", { startingContent: homeStartingContent, homePosts: posts });
      })
      .catch((error) => {
        console.log("Error finding the posts:", error);
      });
})

//Accessing "posts" route parameters
app.get("/posts/:postId", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postId);
  Post.find({})
  .then((posts)=>{
    posts.forEach(function(post){
  
      const postTitle = _.lowerCase(post.title);
        if (requestedTitle === postTitle){
          res.render("post", {title: post.title, content: post.content });
        }
  })
  })  
})

//Accessing about route
app.get("/about", function(req, res){
  res.render("about", {aboutSection: aboutContent});
})
//Accessing contact route
app.get("/contact", function(req, res){
  res.render("contact", {contactSection: contactContent});
})
//Composing new blogs
app.get("/compose", function(req,res){
  res.render("compose");
})

//Posting the composed blogs
app.post("/compose", function(req, res){

  //Creating new posts from the postSchema
  const newPost = new Post ({
        title: req.body.postTitle,
        content: req.body.postBody
  })
  Post.find({})
  .then((posts)=>{
    posts.push(newPost);
    newPost.save();
    console.log("Successfully saved the post:", posts);
    res.redirect("/");
  })
});

//Listening on port 30000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
