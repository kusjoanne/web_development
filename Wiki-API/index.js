const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");

const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const url = "mongodb://127.0.0.1:27017/wikiDB";

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article",articleSchema);

app.listen(3000);

mongoose.connect(url);

app.route("/articles")
.get(function(req,res){
  Article.find(function(err,articles){
    console.log(articles);
  });
})
.post(function(req,res){
  const article = new Article({
    title:req.body.title,
    content:req.body.content
  });
  article.save(function(err){
    if(!err){
      res.send("Saved no errors!")
    }else{
      res.send("There were errors!")
    }
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(err){
      res.send("Articles were not deleted");
    }
  });
});

app.route("/articles/:title")
.get(function(req,res){
  console.log(req.params.title);
  Article.findOne({title:req.params.title},function(err,article){
    res.send(article);
  })
})
.put(function(req,res){
  Article.update({title:req.params.title},{title:req.body.title,content:req.body.content},{overwrite:true},function(err){
    if(!err){
      res.send("Sucessfully updated!");
    }
  })
})
.patch(function(req,res){
  //the req.body passes back a JS Object which basically contains the info we wanna update
  Article.update({title:req.params.title},{$set:req.body},function(err){
    if(!err){
      res.send("Successfully updated article");
    }else{
      res.send(err);
    }
  })
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.title},function(err){
    if(!err){
      res.send("Successfully deleted the article!");
    }
  })
});
