const router = require('express').Router();

const {ReplyViewAll,ReplyInsert,ReplyDelete,ReplyUpdate} = require('../controllers/replyController');

router.post('/',ReplyViewAll);

router.post('/insert',ReplyInsert);

router.post('/update',ReplyUpdate);

router.post('/delete',ReplyDelete);

module.exports = router;