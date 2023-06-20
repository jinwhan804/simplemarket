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
const viewcheckRouter = require('./routers/viewCheck');
const likecheckRouter = require('./routers/likecheck');

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
app.use('/localpost',localpostRouter);
app.use('/viewcheck',viewcheckRouter);
app.use('/likecheck',likecheckRouter);

const server = app.listen(8080, () => {
    console.log("8080 Server Open");
});

const io = socketIo(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

let list = [{ user_id: "", socketId: "" }]
let temp = list.filter((e) => e.user_id == "1");
console.log(temp.socketId);
let userId = [];
let userList = [];

io.sockets.on('connection', (socket) => {

    console.log('유저 입장', socket.id);

    userId.push(socket.id);
    console.log(userId);

    socket.on('joinUser', (name) => {
        userList.push(name);
        io.emit('joinUser', userList, userId);
    })

    socket.on('message', (messageData) => {
        // const nickname = userId[socket.id];
        // console.log(data);
        console.log(messageData)
        io.to(userId[0]).emit('message', messageData);
        io.to(userId[1]).emit('message', messageData);
    })


    socket.on('disconnect', () => {
        console.log('유저 퇴장');
        const index = userId.indexOf(socket.id);
        userId.splice(index, 1);
        io.emit('userList', userList);
        console.log(userId);
    })
})