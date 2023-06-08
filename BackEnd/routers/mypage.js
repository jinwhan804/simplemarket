const router = require("express").Router();
const { nicknameUpdate } = require("../controllers/mypageController");
const { isLogin } = require("../middleware/loginmiddleware");

router.post('/',isLogin, nicknameUpdate);

module.exports = router;