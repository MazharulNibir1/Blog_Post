const express = require("express");
const bodyParser = require("body-parser");
var _ = require("lodash");
require('dotenv').config();

const mongoose = require('mongoose');

const dbURI = process.env.MONGO_URI;

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non turpis interdum, laoreet purus sed, laoreet risus. Pellentesque sed pellentesque velit. Curabitur porta lacus nec luctus mattis. Phasellus pellentesque purus nec pharetra cursus. Suspendisse nec consequat libero. Ut quis orci libero. Nunc hendrerit nunc erat, ac dignissim eros ultricies sed. Donec cursus finibus elit tempor egestas. Praesent consectetur dui vel vulputate efficitur. Ut luctus dignissim arcu, ut commodo velit fringilla id. Mauris lobortis tristique lorem. Maecenas commodo tristique sapien vulputate dictum.";

const aboutContent = "Curabitur sagittis nisl fringilla eros finibus, at mollis dui tincidunt. Aenean ut magna sollicitudin, fringilla lacus eget, efficitur lacus. Integer malesuada quam ante, quis lacinia tortor euismod at. Proin quis accumsan velit. In in interdum nisi, aliquam ultrices libero. Integer eu est lorem. In nec dolor velit. Donec in nibh et tortor aliquam varius et vitae tellus. Fusce sodales in mi eu pretium. Cras sed magna vitae odio vestibulum semper. Proin at dolor eu enim rutrum placerat. Aliquam in libero velit.";

const contactContent = " Donec lectus justo, luctus sed fermentum ac, accumsan sed sapien. Donec pretium pharetra congue. Nunc tempus tincidunt neque, eget rhoncus nisl tempus vehicula. Quisque molestie vestibulum felis. Sed et neque leo. Aenean semper, mauris in maximus fermentum, ipsum justo vulputate dui, eu vulputate massa erat vitae tortor.";



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use((express.static("public")));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURI);
}

const BlogSchema = new mongoose.Schema({
    title: String,
    content: String,
    });

const Blog = mongoose.model('Blog', BlogSchema);


app.get("/", async function(req, res){
    try {
        const post = await Blog.find({},)
        .then(function(posts)
        {res.render('home', {homeContent: homeStartingContent, posts: posts })})
    } catch (err) {
        console.log(err);
    }
});

app.get("/about", function(req, res){
    res.render('about', {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
    res.render('contact', {contactContent: contactContent});
});

app.get("/compose", function(req, res){
    res.render('compose');
    
});

app.get("/posts/:postId", async function(req, res){
    const requestedPostId = req.params.postId;
    
    try {
        const post = await Blog.findOne({_id: requestedPostId});

        if(post){
            res.render('post', {title: post.title , content: post.content});
        } else {
            res.status(404).send("Post not found");
        }
    } catch (err){
        console.log(err);
    }
});




app.post("/compose", async function(req, res){
    const post = new Blog ({
        title: req.body.composedTitle,
        content: req.body.postBody
    });

    try {
        await post.save();
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});



app.listen(3000, function(){
    console.log("Port is open at 3000");
});
