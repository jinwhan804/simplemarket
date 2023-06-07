const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv').config();
const { sequelize } = require('./model');
const cors = require('cors');
const adminRouter = require('./router/adminRouter');

const app = express();

app.set('views', path.join(__dirname, 'page'));
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

app.listen(8080, () => {
    console.log('프로젝트 서버 열림');
})
