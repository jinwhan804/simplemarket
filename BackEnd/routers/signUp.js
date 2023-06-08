const router = require("express").Router();
const { SignUp } = require("../controllers/signUpController");
const { boardMain } = require('../controllers/boardController');


router.post('/', SignUp);

// router.get('/signUp', boardMain);

module.exports = router;