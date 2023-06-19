const router = require('express').Router();
const {PostViewAll} = require('../controllers/postController');

router.get('/',PostViewAll);

module.exports = router;