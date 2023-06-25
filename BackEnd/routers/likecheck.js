const router = require('express').Router();

const {PostLikeCount,PostLikeUpdate,PostLikeCheck} = require('../controllers/likeCheckController');

router.post('/post',PostLikeCount);

router.post('/post/add',PostLikeUpdate);

router.post('/post/btnImg',PostLikeCheck);

module.exports = router;