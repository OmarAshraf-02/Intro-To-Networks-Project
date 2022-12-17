var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var alert= require('alert');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flag = false;
const PORT = process.env.PORT || 3030;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: 'some secret',
  //cookie: {maxAge: 60000000},
  saveUninitialized:false,
  resave:true
}));

//MongoDB Connection
const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
var db = client.db('myDB');

//Express Session Authentication Function 
function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else res.redirect('/');
}

function isEmpty(str) {
  return !str.trim().length;
}

//Get Requests
app.get('/', function(req, res){
  res.render('login')
});
app.get('/registration', function(req, res){
  res.render('registration')
});
app.get('/home',isAuthenticated,function(req,res){
  res.render('home')
});
app.get('/hiking',isAuthenticated,function(req,res){
  res.render('hiking')
});
app.get('/cities',isAuthenticated,function(req,res){
  res.render('cities')
});
app.get('/islands',isAuthenticated,function(req,res){
  res.render('islands')
});
app.get('/annapurna',isAuthenticated,function(req,res){
  res.render('annapurna')
});
app.get('/bali',isAuthenticated,function(req,res){
  res.render('bali')
});
app.get('/inca',isAuthenticated,function(req,res){
  res.render('inca')
});
app.get('/paris',isAuthenticated,function(req,res){
  res.render('paris')
});
app.get('/rome',isAuthenticated,function(req,res){
  res.render('rome')
});
app.get('/santorini',isAuthenticated,function(req,res){
  res.render('santorini')
});
app.get('/searchresults',isAuthenticated,function(req,res){
  res.render('searchresults',{allDests:["Inca","Annapurna","Paris","Rome","Bali","Santorini"],searchTerm,destLinks:["/inca","/annapurna","/paris","/rome","/bali","/santorini"],flag})
});
app.get('/wanttogo',isAuthenticated,function(req,res){
  res.render('wanttogo',{dests:req.session.user.wantgo})
});


var searchTerm="";
//Post Requests
app.post('/register',function(req,res){
  var reg_username = req.body.username;
  var reg_password = req.body.password;
  db.collection("myCollection").findOne({username: reg_username}, function(err, result){
    if((!(result == null)) || reg_username=="" || reg_password==""){
      alert('Invalid entries, please fill both fields or try new username')
      res.redirect('/registration');
    }
    else{
      db.collection("myCollection").insertOne({username:reg_username, password:reg_password,wantgo:[]});
      alert('Registration Successful! Please Login');
      res.redirect('/');
    }
  });
});
app.post('/', function(req, res){
  var login_username = req.body.username;
  var login_password = req.body.password;
  if((login_username == "admin") && (login_password == "admin"))
  {
    req.session.user = "admin";
    req.session.save();
    console.log(req.session.user);
    res.redirect('/home');
  }
  else {
  db.collection("myCollection").findOne({username: login_username}, function(err,result){
    if((result == null))
    {
      alert('User not registered, please press I dont have an account');
      res.redirect('/');
    }
    else if(result.password!=login_password)
    {
      alert('Incorrect password, please try again');
      res.redirect('/');
    }
    else
    {
      req.session.user = result;
      req.session.save();
      res.redirect('/home');
    }
  });
}});

app.post('/inca',function(req,res){
    if((req.session.user.wantgo.length === 0) || !(req.session.user.wantgo.includes("Inca Trail to Machu Picchu"))){
      req.session.user.wantgo.push("Inca Trail to Machu Picchu");
      db.collection("myCollection").updateOne({username:req.session.user.username},{$set:{wantgo:req.session.user.wantgo}});
      db.collection("myCollection").findOne({username: req.session.user.username},(err,result)=>{
        req.session.user=result;
        req.session.save();
      });
     res.redirect('/inca');
    }
    else{
      alert('This destination is already on your Want-To-Go List');
      res.redirect('/inca');
    }
});
app.post('/annapurna',function(req,res){
  if((req.session.user.wantgo.length === 0) || !(req.session.user.wantgo.includes("Annapurna Circuit"))){
    req.session.user.wantgo.push("Annapurna Circuit");
    db.collection("myCollection").updateOne({username:req.session.user.username},{$set:{wantgo:req.session.user.wantgo}});
    db.collection("myCollection").findOne({username: req.session.user.username},(err,result)=>{
      req.session.user=result;
      req.session.save();
    });
   res.redirect('/annapurna');
  }
  else{
    alert('This destination is already on your Want-To-Go List');
    res.redirect('/annapurna');
  }
});
app.post('/bali',function(req,res){
  if((req.session.user.wantgo.length === 0) || !(req.session.user.wantgo.includes("Bali Island"))){
    req.session.user.wantgo.push("Bali Island");
    db.collection("myCollection").updateOne({username:req.session.user.username},{$set:{wantgo:req.session.user.wantgo}});
    db.collection("myCollection").findOne({username: req.session.user.username},(err,result)=>{
      req.session.user=result;
      req.session.save();
    });
   res.redirect('/bali');
  }
  else{
    alert('This destination is already on your Want-To-Go List');
    res.redirect('/bali');
  }
});
app.post('/santorini',function(req,res){
  if((req.session.user.wantgo.length === 0) || !(req.session.user.wantgo.includes("Santorini Island"))){
    req.session.user.wantgo.push("Santorini Island");
    db.collection("myCollection").updateOne({username:req.session.user.username},{$set:{wantgo:req.session.user.wantgo}});
    db.collection("myCollection").findOne({username: req.session.user.username},(err,result)=>{
      req.session.user=result;
      req.session.save();
    });
   res.redirect('/santorini');
  }
  else{
    alert('This destination is already on your Want-To-Go List');
    res.redirect('/santorini');
  }
});
app.post('/paris',function(req,res){
  if((req.session.user.wantgo.length === 0) || !(req.session.user.wantgo.includes("Paris"))){
    req.session.user.wantgo.push("Paris");
    db.collection("myCollection").updateOne({username:req.session.user.username},{$set:{wantgo:req.session.user.wantgo}});
    db.collection("myCollection").findOne({username: req.session.user.username},(err,result)=>{
      req.session.user=result;
      req.session.save();
    });
   res.redirect('/paris');
  }
  else{
    alert('This destination is already on your Want-To-Go List');
    res.redirect('/paris');
  }
});
app.post('/rome',function(req,res){
  if((req.session.user.wantgo.length === 0) || !(req.session.user.wantgo.includes("Rome"))){
    req.session.user.wantgo.push("Rome");
    db.collection("myCollection").updateOne({username:req.session.user.username},{$set:{wantgo:req.session.user.wantgo}});
    db.collection("myCollection").findOne({username: req.session.user.username},(err,result)=>{
      req.session.user=result;
      req.session.save();
    });
   res.redirect('/rome');
  }
  else{
    alert('This destination is already on your Want-To-Go List');
    res.redirect('/rome');
  }
});
app.post('/search',function(req,res){
    searchTerm = req.body.Search;
    /*if(isEmpty(searchTerm))
    {
      res.redirect('back');
    }*/
    res.redirect('/searchresults');
});



app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
