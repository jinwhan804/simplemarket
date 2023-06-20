const router = require('express').Router();

const {ViewCount,ViewUserAdd} = require('../controllers/viewCheckController');

router.post('/',ViewCount);

router.post('/add',ViewUserAdd);

module.exports = router;