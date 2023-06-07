const router = require('express').Router();
const {PostViewAll} = require('../controllers/postController');
const {isLogin} = require('../../middleware/loginmiddleware');

router.get('/',PostViewAll);

router.get('/insert',async(req,res)=>{
    const data = {
        nickname : "test"
    };    
    res.json(data);
})

module.exports = router;