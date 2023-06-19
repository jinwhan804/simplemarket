const router = require('express').Router();

const {LocalPostView} = require('../controllers/localpostController');

const {isLogin} = require('../middleware/loginmiddleware');

router.get('/',isLogin,LocalPostView);

module.exports = router;