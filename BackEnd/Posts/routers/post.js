const router = require('express').Router();
const {PostViewAll,PostInsert} = require('../controllers/postController');
const {isLogin} = require('../middleware/loginmiddleware');
const {User} = require('../model');

router.get('/',(req,res,next)=>{
    User.create({
        name : "123",
        age : '35',
        user_id : "123",
    })
    next();
},PostViewAll);

// router.get('/insert',isLogin,async(req,res)=>{
//     const {access_decoded} = req;
//     res.json(access_decoded);
// })

router.get('/insert',(req,res)=>{
    const data = {
        userId : "1"
    }

    res.json(data);
})

router.post('/insert',PostInsert);

router.post('/detail')

router.get('/detail')

module.exports = router;