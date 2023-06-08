const router = require("express").Router();
const { Upload } = require("../middleware/imgUploads");
const { uploadProfileImage } = require("../controllers/uploadController");
const { isLogin } = require("../middleware/loginmiddleware");

router.post("/", Upload.single("upload"), isLogin , uploadProfileImage);

module.exports = router;