const router = require("express").Router();
const { nicknameUpdate } = require("../controllers/mypageController");
const { PostViewOne, PostViewSelect} = require("../controllers/postController");
const { isLogin } = require("../middleware/loginmiddleware");

router.post('/',isLogin, nicknameUpdate);

router.post('/detail',isLogin,PostViewSelect);

router.get('/detail',isLogin,PostViewOne);

module.exports = router;