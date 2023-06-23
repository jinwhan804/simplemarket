const router = require("express").Router();
const { logout } = require("../controllers/logoutController");
const {isLogin} = require('../middleware/loginmiddleware')

router.post('/',isLogin, logout);

module.exports = router;