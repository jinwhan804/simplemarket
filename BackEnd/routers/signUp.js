const router = require("express").Router();
const { SignUp } = require("../controllers/signUpController")

router.post('/', SignUp);

module.exports = router;