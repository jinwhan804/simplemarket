// express express-session cors sequelize mysql2 dotenv

const express = require("express");
const cors = require("cors");
const dot = require("dotenv").config();
const session = require("express-session");
const { sequelize } = require("./models");
const path = require("path");

const SignUpRouter = require("./routers/signUp");
const LoginRouter = require("./routers/login");
const uploadRouter = require("./routers/upload");
const nicknameUpdateRouter = require("./routers/mypage");
const postRouter = require('./routers/post');
const adminRouter = require('./routers/adminRouter');
const boardRouter = require('./routers/boardRouter');

const app = express();

sequelize.sync({force:false})
.then(() => {
    console.log("연결 성공")
})
.catch((err)=>{
    console.log(err);
});

app.use(session({
    secret : process.env.SESSION_KEY,
    resave : false,
    saveUninitialized : false
}));

app.use(express.urlencoded({extended:false}));

app.use("/img", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.use(cors({
    origin : "http://127.0.0.1:5500",
    credentials : true
}));

app.use('/signUp', SignUpRouter);
app.use('/login', LoginRouter);
app.use('/upload', uploadRouter);
app.use('/mypage', nicknameUpdateRouter);
app.use('/post',postRouter);
app.use('/admin', adminRouter);
app.use('/signUpList', boardRouter);

app.listen(8080, () => {
    console.log("8080 Server Open");
});