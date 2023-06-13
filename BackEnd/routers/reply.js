const router = require('express').Router();

const {ReplyViewAll} = require('../controllers/replyController');

router.post('/',ReplyViewAll);

module.exports = router;