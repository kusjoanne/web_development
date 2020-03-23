//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
const port = 3000;
const dbName = "secretsUserDB";

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect("mongodb://127.0.0.1:27017/" + dbName, {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
const secret  = process.env.SECRET;
console.log(secret);
userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']});

const User = mongoose.model("User", userSchema);

app.listen(port,function(){
  console.log("Listening on port "+port)
});

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  console.log(user);
  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err, results){
    if(err){
      console.log(err);
    }else{
      if(results){
        if(results.password === password){
          res.render("secrets");
        }else{
          res.render("login");
        }
      }else{
        res.render("login");
      }
    }
  })
});

//level 1: saving un and pw in plaintext in db
//Level 2: encrypt the pasword
