const router = require('express').Router();
const { AdminLogIn, SignUp, Login } = require('../controller/adminController');
const { boardMain } = require('../controller/boardController');

router.post('/login', AdminLogIn);

router.get('/signUp', boardMain);

router.post('/signUp', SignUp);

router.post("/login", Login);

module.exports = router;