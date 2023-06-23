const router = require("express").Router();
const { Login, viewUser, viewAll } = require("../controllers/loginController");
const { isLogin } = require("../middleware/loginmiddleware");

router.post("/", Login);

router.post("/view", isLogin, viewUser);

router.post('/viewAll', isLogin, viewAll);

module.exports = router;