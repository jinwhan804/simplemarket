const router = require('express').Router();
const { boardMain, approveUser, rejectUser } = require('../controller/boardController');

router.get('/', boardMain);

router.post('/approve_user', approveUser);

router.post('/reject_user', rejectUser);

module.exports = router;