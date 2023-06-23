const router = require('express').Router();

const {LocalPostView,LocalSelectPostView} = require('../controllers/localpostController');

const {isLogin} = require('../middleware/loginmiddleware');

router.post('/',isLogin,LocalPostView);

router.post('/regionSelete',LocalSelectPostView);

module.exports = router;