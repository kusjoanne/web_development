//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const date = require(__dirname+"/date.js");
const port = 3000;
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const url = "mongodb://localhost:27017";
mongoose.connect(url+"/todolistDB", { useNewUrlParser: true });

const itemSchema = new mongoose.Schema({
  name: String
});

const Task = mongoose.model("Task",itemSchema);

app.listen(port,function(){
  console.log("Listening on port "+port);
});

app.get("/",function(req,res){
  Task.find({},function(err, foundTasks){
    console.log(foundTasks);
    res.render('list',{listTitle:"Today",newListItems:foundTasks});
  });
  //res.render('list',{listTitle:date.getDate(),newListItems:items});
});

const myRoute;
app.get(myRoute, function(req,res){

});

app.get("/about",function(req,res){
  res.render("about");
});

app.post("/",function(req,res){
  console.log(req.body);
  let item = req.body.itemName;

  const task = new Task({
    name: item
  });

  task.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const taskID = req.body.checkbox;
  Task.findByIdAndRemove({_id:taskID}, function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

//HOW TO DYNCAMICALLY CREATE LISTS AND ROUTES
