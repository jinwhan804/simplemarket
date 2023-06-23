const router = require('express').Router();
const {PostViewAll,PostInsert,PostInsertView,PostViewOne,PostViewSelect,PostUpdateSelect,PostUpdate,PostDelete,PostLikes} = require('../controllers/postController');
const {isLogin} = require('../middleware/loginmiddleware');

router.post('/',isLogin,PostViewAll);

router.get('/insert',isLogin,PostInsertView);

router.post('/insert',PostInsert);

router.post('/detailin',isLogin,PostViewSelect);

router.get('/detail',isLogin,PostViewOne);

router.post('/updateview',isLogin,PostUpdateSelect);

router.get('/updateview',isLogin,PostViewOne);

router.post('/update',PostUpdate);

router.post('/delete',isLogin,PostDelete);

module.exports = router;