const router = require('express').Router();
const {PostViewAll,PostInsert,PostInsertView} = require('../controllers/postController');
const {isLogin} = require('../middleware/loginmiddleware');

router.get('/',PostViewAll);

router.get('/insert',isLogin,PostInsertView);

router.post('/insert',PostInsert);

router.post('/detail')

router.get('/detail')

module.exports = router;