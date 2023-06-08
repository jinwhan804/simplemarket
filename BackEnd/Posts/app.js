const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dot = require('dotenv').config();
const path = require('path');

const {sequelize} = require('./model');
const postRouter = require('./routers/post');
const SignUpRouter = require("./routers/signUp");
const LoginRouter = require("./routers/login");
const uploadRouter = require("./routers/upload");

const app = express();

app.use(cors({
    origin : "http://127.0.0.1:5500",
    credentials : true
}))

app.use(express.urlencoded({extended : false}));
app.use('/img',express.static(path.join(__dirname,'uploads')));

app.use(express.json());

app.use(session({
    secret : process.env.SESSION_KEY,
    resave : false,
    saveUninitialized : false
}))

sequelize.sync({force : false}).then(()=>{
    console.log('연결 성공');
}).catch((err)=>{
    console.log(err);
})

app.use('/post',postRouter);
app.use('/signUp', SignUpRouter);
app.use('/login', LoginRouter);
app.use('/upload', uploadRouter);

app.listen(8080,()=>{
    console.log('server open');
})