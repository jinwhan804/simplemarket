const router = require('express').Router();
const {PostViewAll,PostInsert,PostInsertView,PostViewOne,PostViewSelect} = require('../controllers/postController');
const {isLogin} = require('../middleware/loginmiddleware');

router.get('/',PostViewAll);

router.get('/insert',isLogin,PostInsertView);

router.post('/insert',PostInsert);

router.post('/detail',isLogin,PostViewSelect);

router.get('/detail',isLogin,PostViewOne);

router.post('/updateview',isLogin,PostViewSelect);

module.exports = router;