const express = require("express");
const fs = require("fs");
const app = express();


app.get('/',(req,res)=>{
   const page = fs.readFileSync("./main.html","utf-8");
   res.send(page);
})

app.listen(3000,()=>{

})