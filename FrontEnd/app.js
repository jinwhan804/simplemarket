const express = require("express");
const fs = require("fs");
const path = require('path');
const app = express();

app.use('/css',express.static(path.join(__dirname,"css")));
app.use('/js',express.static(path.join(__dirname,"js")));

app.get('/',(req,res)=>{
   const page = fs.readFileSync("./main.html","utf-8");
   res.send(page);
})

app.get('/login',(req,res)=>{
   const page = fs.readFileSync("./login.html","utf-8");
   res.send(page);
})

app.get('/mypage',(req,res)=>{
   const page = fs.readFileSync("./mypage.html","utf-8");
   res.send(page);
})

app.get('/signUp',(req,res)=>{
   const page = fs.readFileSync("./signUp.html","utf-8");
   res.send(page);
})

app.get('/signUpList',(req,res)=>{
   const page = fs.readFileSync("./signUpList.html","utf-8");
   res.send(page);
})

app.get('/post',(req,res)=>{
   const page = fs.readFileSync("./post.html","utf-8");
   res.send(page);
})

app.get('/insert',(req,res)=>{
   const page = fs.readFileSync("./insert.html","utf-8");
   res.send(page);
})

app.get('/detail',(req,res)=>{
   const page = fs.readFileSync("./detail.html","utf-8");
   res.send(page);
})

app.get('/update',(req,res)=>{
   const page = fs.readFileSync("./update.html","utf-8");
   res.send(page);
})



app.listen(3000,()=>{
   console.log('front server on');
})