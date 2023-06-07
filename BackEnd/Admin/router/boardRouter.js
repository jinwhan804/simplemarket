const router = require('express').Router();
const { boardMain, approveUser } = require('../controller/boardController');

router.get('/', boardMain);

router.post('/approve_user', approveUser);

module.exports = router;