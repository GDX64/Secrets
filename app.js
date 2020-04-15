//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//const encrypt = require('mongoose-encryption');
//const md5=require('md5');

const saltRounds = 10;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//=================Mongoose stuff======================


mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//To  encrypt the database
//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('user', userSchema);

user1 = new User({email: 'reidelash',
password: 'th123'});

// user1.save(function(err){
//   console.log('User1 was saved');
// });
//============Routing==============

app.route('/')
.get(function(req, res){
  res.render('home');
});


app.route('/login')
.get(function(req, res){
  res.render('login');
})

.post(function(req, res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email: username}, function(err, result){
    if(err){
      res.send(err);
      console.log(err);
    }
    else{
      if(result){
        console.log(`Found user ${username}`);

        bcrypt.compare(password, result.password, function(err, check) {
          if(check){
            res.render('secrets');
          }else res.send('password is incorrect');
        });

      }
      else{
        res.send('The user name is incorrect');
      }
    }
  });
});


app.route('/register')
.get(function(req, res){
  res.render('register');
})

.post(function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if(err) console.log(err);
    else{

      const newUser = new User({
        email: req.body.username,
        password: hash
      });

      newUser.save(function(err){
        if(err){
          console.log(err);
          res.render(err);
        }
        else{
          console.log(req.body.username+' has been registered successfuly');
          res.render('secrets');
        }
      });
    }
  });
});

app.listen(3000, function(req, res){
  console.log('The Server is listening');
});
