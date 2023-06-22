const router = require("express").Router();
const { logout } = require("../controllers/logoutController");
const {isLogin} = require('../middleware/loginmiddleware')

router.get('/',isLogin, logout);

module.exports = router;