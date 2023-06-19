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


// let list = [{ user_id: '', socketId: '' }];
// let temp = list.filter((e) => e.user_id == "1");
// console.log(temp.socketId);
let userId = [];
let users = {};
let userList = [];


io.sockets.on('connection', (socket) => {


    console.log('유저 입장', socket.id);

    userId.push(socket.id);
    console.log(userId);  // ['socket.id', 'socket.id',...]

    socket.on('join', (userId) => {
        // console.log(userId);
        users[userId] = socket.id;
        console.log(users);  // { admin: 'socket.id', a: 'socket.id'}

        if (!users[userId]) {
            users[userId] = [];
        }
        userList.push(users);
        console.log(userList);

    })

    socket.on('message', (messageData, userId) => {
        // const nickname = userId[socket.id];
        // console.log(data);
        console.log(users["admin"])
        console.log(users[userId])
        // userId 어드민은 보내는 유저를 넣어주자

        console.log(messageData)
        io.to(users['admin']).emit('message', messageData);
        io.to(users[userId]).emit('message', messageData);
    })

    // socket.on('message', (messageData, receiverId) => {
    //     // Ensure the recipient user exists and is online.
    //     if (!users[receiverId]) {
    //         console.error(`User ${receiverId} is not online or doesn't exist.`);
    //         return;
    //     }

    //     // Retrieve recipient socket id from 'users' object
    //     const receiverSocketId = users[receiverId];

    //     // Send message to the recipient and the sender
    //     socket.to(receiverSocketId).emit('message', messageData);
    //     socket.emit('message', messageData);
    // })


    socket.on('disconnect', () => {
        console.log('유저 퇴장');
        const index = userId.indexOf(socket.id);
        userId = userId.filter((value) => value != socket.id);
        for (let user in users) {
            if (users[user] === socket.id) {
                delete users[user];
            }
        }
        userList.splice(index, 1);
        io.emit('userList', userList);
        console.log(userId);
    })
})