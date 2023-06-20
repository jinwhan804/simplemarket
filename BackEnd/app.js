// express express-session cors sequelize mysql2 dotenv

const express = require("express");
const cors = require("cors");
const dot = require("dotenv").config();
const session = require("express-session");
const { sequelize } = require("./models");
const path = require("path");
const socketIo = require("socket.io");
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk'); // 이미지 파일 업로드 클라우드

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
const rereplyRouter = require('./routers/rereply');
const localpostRouter = require('./routers/localpost');

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

// app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ limit: '4mb', extended: true }));

app.use("/img", express.static(path.join(__dirname, "uploads")));

// app.use(express.json());
app.use(express.json({ limit: '4mb' }));



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
app.use('/rereply', rereplyRouter);
app.use('/localpost', localpostRouter);

const server = app.listen(8080, () => {
    console.log("8080 Server Open");
});

const io = socketIo(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});


// let list = [{ user_id: '', socketId: '' }];
// let temp = list.filter((e) => e.user_id == "1");
// console.log(temp.socketId);
let userId = [];
let users = {};
let userList = []; // 방에 있는 유저


io.sockets.on('connection', (socket) => {


    console.log('유저 입장', socket.id);
    userId.push(socket.id);
    console.log(userId);

    socket.on('joinRoom', (room, nickname) => {
        socket.join(room);
        userList.push({ nickname, id: socket.id });
        io.to(room).emit('joinRoom', room, nickname, userList);
    })


    // 닉네임 : 메시지를 보내는 사용자의 닉네임
    socket.on('message', (nickname, room, messageData) => {
        io.to(room).emit('message', nickname, messageData);
    })

    socket.on('disconnect', () => {
        console.log('유저 나감');
        userList = userList.filter((value) => value.id != socket.id);
        userId = userId.filter((value) => value != socket.id);
    })
})