const router = require('express').Router();

const {PostStatistic,PostData} = require('../controllers/statisticController');

router.get('/',PostData);

router.post('/',PostStatistic);

module.exports = router;