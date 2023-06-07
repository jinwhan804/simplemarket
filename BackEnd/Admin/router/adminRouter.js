const router = require('express').Router();
const { LogIn } = require('../controller/adminController');
const { isLogin } = require('../middleware/loginMiddleware');

router.post('/login', LogIn);

module.exports = router;