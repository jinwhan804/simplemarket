const router = require("express").Router();
const { SignUp, Login } = require("../controller/userController")
const { boardMain } = require('../controller/boardController');

router.post('/signUp', SignUp);

router.get('/signUp', boardMain);

router.post("/", Login);

module.exports = router;