const {Stat} = require('../models');
const stat_type = 'postView';

exports.ViewCount = async(req,res)=>{
    try {
        const id = req.body.data;
        
        const stat = await Stat.findAll({
            where : {stat_type,postId : id}
        })

        res.send(stat);
    } catch (error) {
        console.log('뷰 체크 컨트롤러에서 조회수 카운트하다 에러남');
        console.log(error);
    }
}

exports.ViewUserAdd = async(req,res)=>{
    try {
        const {postId, userId} = req.body;
        
        if(userId != 1){
            await Stat.create({
                stat_type,
                postId,
                userId
            })
        }

        res.send();
    } catch (error) {
        console.log('뷰 체크 컨트롤러에서 조회수 추가하다 에러남');
        console.log(error);
    }
}