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

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const Task = mongoose.model("Task",itemSchema);
const List = mongoose.model("List",listSchema);

app.listen(port,function(){
  console.log("Listening on port "+port);
});

app.get("/",function(req,res){
  Task.find({},function(err, foundTasks){
    console.log(foundTasks);
    res.render('list',{listTitle:"Today",newListItems:foundTasks});
  });
});

app.get("/:customListName", function(req,res){
  const listName = req.params.customListName;
  List.findOne({name:listName},function(err,results){
    if(results){
      res.render('list',{listTitle:listName,newListItems:results.items});
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



  // const NewCollection = mongoose.model(listName,itemSchema);
  // NewCollection.find({},function(err, foundTasks){
  //   res.render('list',{listTitle:listName,newListItems:foundTasks});
  // });
// });

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
  const taskID = req.body.checkboxname;
  Task.findByIdAndRemove({_id:taskID}, function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.post("/:customListName",function(req,res){
  const newTask = req.body.itemName;
  const customListName = req.params.customListName;
  console.log ("newTask: "+newTask+" collection: "+collection);
  // const Task = mongoose.model(collection,itemSchema);

  const task = new Task({
    name:newTask
  });
  const list = new List({
    name: customListName,
    items: [task]
  });
  task.save();
  list.save();
  res.redirect("/"+customListName);
});
