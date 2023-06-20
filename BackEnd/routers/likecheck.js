const router = require('express').Router();

const {PostLikeCount,PostLikeUpdate} = require('../controllers/likeCheckController');

router.post('/post',PostLikeCount);

router.post('/post/add',PostLikeUpdate);

module.exports = router;