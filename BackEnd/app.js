// express express-session cors sequelize mysql2 dotenv

const express = require("express");
const cors = require("cors");
const dot = require("dotenv").config();
const session = require("express-session");
const { sequelize } = require("./models");
const path = require("path");
const socketIo = require("socket.io");
const cookieParser = require('cookie-parser');

const SignUpRouter = require("./routers/signUp");
const LoginRouter = require("./routers/login");
const LogoutRouter = require("./routers/logout");
const uploadRouter = require("./routers/upload");
const nicknameUpdateRouter = require("./routers/mypage");
const postRouter = require('./routers/post');
const adminRouter = require('./routers/adminRouter');
const boardRouter = require('./routers/boardRouter');
const chatRouter = require('./routers/chatRouter');
const replyRouter = require('./routers/reply');

const app = express();

sequelize.sync({ force: false })
    .then(() => {
        console.log("연결 성공")
    })
    .catch((err) => {
        console.log(err);
    });
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({ extended: false }));

app.use("/img", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.use(cors({
    origin: `${process.env.FRONT_SERVER}`,
    credentials: true
}));

app.use('/signUp', SignUpRouter);
app.use('/login', LoginRouter);
app.use('/logout', LogoutRouter);
app.use('/upload', uploadRouter);
app.use('/mypage', nicknameUpdateRouter);
app.use('/post', postRouter);
app.use('/admin', adminRouter);
app.use('/signUpList', boardRouter);
app.use('/chat', chatRouter);
app.use('/reply', replyRouter);

const server = app.listen(8080, () => {
    console.log("8080 Server Open");
});

const io = socketIo(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

let userId = [];
let userList = [];

io.sockets.on('connection', (socket) => {
    console.log('유저 입장');

    userId.push(socket.id);
    console.log(userId);

    socket.on('joinUser', (name) => {
        userList.push(name);
        io.socket.emit('joinUser', userList, userId);
    })

    socket.on('message', (data) => {
        io.sockets.emit('message', data);
        console.log(data);
    })

    socket.on('oneUserChat', (id, nickName, msg) => {
        io.to(id).emit('chat', nickName, msg);
    })

    socket.on('disconnect', () => {
        console.log('유저 퇴장');
        let index = userId.indexOf(socket.id);
        userId = userId.filter((value) => value != socket.id);
        userList.splice(index, 1);
        io.emit('userList', userList);
        console.log(userId);
    })
})