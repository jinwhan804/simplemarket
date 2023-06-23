const router = require('express').Router();
const {PostViewAll,PostInsert,PostInsertView,PostViewOne,PostViewSelect,PostUpdateSelect,PostUpdate,PostDelete,PostLikes} = require('../controllers/postController');
const {isLogin} = require('../middleware/loginmiddleware');

router.post('/',isLogin,PostViewAll);

router.post('/insertIn',isLogin,PostInsertView);

router.post('/insert',PostInsert);

router.post('/detailIn',isLogin,PostViewSelect);

router.post('/detail',isLogin,PostViewOne);

router.post('/updateviewIn',isLogin,PostUpdateSelect);

router.post('/updateview',isLogin,PostViewOne);

router.post('/update',PostUpdate);

router.post('/delete',isLogin,PostDelete);

module.exports = router;