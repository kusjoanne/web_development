//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")
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

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const Task = mongoose.model("Task",itemSchema);
const List = mongoose.model("List",listSchema);

app.listen(port,function(){
  console.log("Listening on port "+port);
});

//////////////////////////GETS///////////////////////

app.get("/",function(req,res){
  Task.find({},function(err, foundTasks){
    console.log(foundTasks);
    res.render('list',{listTitle:"All Tasks",newListItems:foundTasks});
  });
});

app.get("/:customListName", function(req,res){
  const listName = _.capitalize(req.params.customListName);
  List.findOne({name:listName},function(err,foundList){
    //if a list exists pass those items
    if(foundList){
      res.render('list',{listTitle:foundList.name,newListItems:foundList.items});
    }
    //if the list doesn't exist,
    else{
      const list = new List({
        name: listName,
        items: [{name:"New Entry"}]
      });
      list.save();
      res.redirect("/"+listName);
    }
  });
});

app.get("/about",function(req,res){
  res.render("about");
});

//////////////////////////POSTS///////////////////////

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
  const taskID = req.body.checkboxname;
  const listName = req.body.listName;
  //removes task from task list
  Task.findByIdAndRemove({_id:taskID}, function(req,res){
    console.log("deleted");
  });
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:taskID}}}, function(err,list){
    res.redirect("/"+listName);
    list.save();
  });
});

app.post("/:customListName",function(req,res){
  const newTask = req.body.itemName;
  const customListName = req.params.customListName;

  const task = new Task({
    name:newTask
  });
  task.save();

  List.findOne({name: customListName},function(err,foundList){
    foundList.items.push(task);
    foundList.save();
  });
  res.redirect("/"+customListName);
});
