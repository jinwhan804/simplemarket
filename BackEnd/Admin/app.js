const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv').config();
const { sequelize } = require('./model');
const cors = require('cors');
const adminRouter = require('./router/adminRouter');
const boardRouter = require('./router/boardRouter');

const app = express();
app.use(express.json()); // 들어오는 요청에서 JSON 본문 데이터를 구문 분석할 수 있다

// app.set('views', path.join(__dirname, 'page'));
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))

sequelize.sync({ force: false }).then(() => {
    console.log('연결성공');
}).catch((err) => {
    console.log(err);
})


app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))

app.use('/', adminRouter);
app.use('/signUpList', boardRouter);

app.listen(8080, () => {
    console.log('프로젝트 서버 열림');
})
