//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const port = process.env.PORT;
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//const url = "mongodb://127.0.0.1:27017";

const url = "mongodb+srv://admin-joanne:myMoon1204@cluster0-9ruej.mongodb.net/todolistDB?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true });

const itemSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const Task = mongoose.model("Task",itemSchema);
const List = mongoose.model("List",listSchema);

const defaultTask = new Task({
  name:"New Entry"
});

app.listen(port || 3000,function(){
  console.log("Listening on port "+port);
});

//////////////////////////GETS///////////////////////

app.get("/",function(req,res){
  Task.find(function(err,foundTasks){
    if(foundTasks){
      res.render('list',{listTitle:"Today",newListItems:foundTasks});
    }else{
      defaultTask.save();
      res.redirect("/");
    }
  });
});

app.get("/:customListName", function(req,res){
  const listName = _.capitalize(req.params.customListName);
  List.findOne({name:listName},function(err,foundList){
    if(foundList){
      res.render('list',{listTitle:foundList.name,newListItems:foundList.items});
    }else{
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
  const listName = req.body.list;
  const item = req.body.itemName;

  const task = new Task({
    name: item
  });

  if(listName === "Today"){
    task.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName},function(err,foundList){
        foundList.items.push(task);
        foundList.save();
        res.redirect("/"+listName);
    });
  }
});

app.post("/delete",function(req,res){
  const taskID = req.body.checkboxname;
  const listName = req.body.listName;
  if(listName==="Today"){
    Task.findOneAndRemove({_id:taskID},function(err,list){
      res.redirect("/");
    });
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:taskID}}}, function(err,list){
      res.redirect("/"+listName);
    });
  }
});
