//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const bcrypt = require("bcrypt");
//const md5 = require("md5");
//const encrypt = require("mongoose-encryption");

const app = express();
const port = 3000;
const dbName = "secretsUserDB";
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

//tell our app to use the session package
app.use(session({
  secret: "longstringofmychoosing",
  resave: false,
  saveUninitialized: false
}));

//tell our app to use passport
app.use(passport.initialize());
//tell our app to use passport to deal with passport
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/" + dbName, {useNewUrlParser:true});
mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
// const secret  = process.env.SECRET;
// console.log(secret);
//userSchema.plugin(encrypt,{secret:secret, //encryptedFields:['password']});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/secrets", function(req, res){
  if (req.isAuthenticated()){
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

app.post("/register",function(req,res){
  User.register({username:req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res,function(err, user){
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/login",function(req,res){
  const user = new User({
    username:req.body.username,
    password:req.body.passport
  });

  req.login(user, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });
});

// app.post("/register",function(req,res){
//   const username = req.body.username;
//   const password = req.body.password;
//
//   bcrypt.hash(password, saltRounds, function(err,hash){
//     const user = new User({
//       email: req.body.username,
//       password: hash
//       //password: md5(req.body.password)
//     });
//     console.log(user);
//     user.save(function(err){
//       if(err){
//         console.log(err);
//       }else{
//         res.render("secrets");
//       }
//     });
//   });
// });

// app.post("/login",function(req,res){
//   const username = req.body.username;
//   //const password = md5(req.body.password);
//   const password = req.body.password;
//
//
//   User.findOne({email:username},function(err, results){
//     if(err){
//       console.log(err);
//     }else{
//       if(results){
//         //returns a boolean
//         bcrypt.compare(password, results.password,function(err,result){
//           if(result){
//             res.render("secrets");
//           }else{
//             res.render("login");
//           }
//         });
//       }else{
//         res.render("login");
//       }
//     }
//   })
// });
