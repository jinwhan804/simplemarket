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
const uuid = require('uuid'); // 이미지 이름 줄여주는 패키지

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
const viewcheckRouter = require('./routers/viewCheck');
const likecheckRouter = require('./routers/likecheck');
const statisticRouter = require('./routers/statistic');

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
app.use('/viewcheck', viewcheckRouter);
app.use('/likecheck', likecheckRouter);
app.use('/statistic', statisticRouter);

const server = app.listen(3030, () => {
    console.log("3030 Server Open");
});

const io = socketIo(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});


let userId = [];
let users = {};
let userList = []; // 방에 있는 유저
let userJoinStatus = new Map();

io.sockets.on('connection', (socket) => {

    console.log('유저 입장', socket.id);
    userId.push(socket.id);
    console.log(userId);

    socket.on('joinRoom', (room, user) => {
        console.log(user);
        socket.join(room);
        console.log(io.sockets.adapter.rooms);
        userList.push({ user, id: socket.id });
        console.log(userList);
        io.to(room).emit('joinRoom', room, user, userList);
    })


    socket.on('chat', (room, data) => {
        console.log(data);
        console.log(room)
        io.to(room).emit('chat', data);
    })

    socket.on('leaveRoom', (room, user) => {
        socket.leave(room);
        console.log('ddd', user)
        console.log(io.sockets.adapter.rooms);

        console.log('before', userList);

        io.to(room).emit('leaveRoom', room, user)
        userList = userList.filter((value) => value.user.nickname != user.nickname);
        console.log(userList);
    })

    socket.on('disconnect', () => {
        console.log('유저 나감');
        userList = userList.filter((value) => value.id != socket.id);
        userId = userId.filter((value) => value != socket.id);
    })
})