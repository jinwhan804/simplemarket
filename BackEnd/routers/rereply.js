const router = require('express').Router();

const {RereplyView,RereplyDelete,RereplyInsert,RereplyUpdate} = require('../controllers/rereplyController');

router.post('/',RereplyView);

router.post('/insert',RereplyInsert);

router.post('/update',RereplyUpdate);

router.post('/delete',RereplyDelete);

module.exports = router;