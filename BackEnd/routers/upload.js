const router = require("express").Router();
const { Upload } = require("../middleware/imgUploads");
const { uploadProfileImage, uploadProfileImage2 } = require("../controllers/uploadController");
const { isLogin } = require("../middleware/loginmiddleware");

router.post("/", Upload.single("upload"), isLogin , uploadProfileImage);
router.post("/postImg", Upload.single("upload"), isLogin , uploadProfileImage2);

module.exports = router;