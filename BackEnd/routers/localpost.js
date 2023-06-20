const router = require('express').Router();

const {LocalPostView,LocalSelectPostView} = require('../controllers/localpostController');

const {isLogin} = require('../middleware/loginmiddleware');

router.get('/',isLogin,LocalPostView);

router.post('/',LocalSelectPostView);

module.exports = router;