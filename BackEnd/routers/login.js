const router = require("express").Router();
const { Login, viewUser, viewAll } = require("../controllers/loginController");
const { isLogin } = require("../middleware/loginmiddleware");

router.post("/", Login);

router.get("/view", isLogin, viewUser);

router.get('/viewAll', isLogin, viewAll);

module.exports = router;