const {Stat}= require('../models');
const stat_type = 'postLike';

exports.PostLikeCount = async(req,res)=>{
    try {
        const id = req.body.data;

        const stat = await Stat.findAll({where : {stat_type,postId : id}});

        res.send(stat);
    } catch (error) {
        console.log('라이크 컨트롤러에서 본문 좋아요 카운팅하다 오류남');
        console.log(error);
    }
}

exports.PostLikeUpdate = async(req,res)=>{
    try {
        const {postId,userId} = req.body;

        const stat = await Stat.findOne({where : {stat_type,postId,userId}});

        if(stat != null){
            await Stat.destroy({where : {stat_type,postId,userId}});
        }else{
            await Stat.create({
                stat_type,
                postId,
                userId
            })
        }

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log('라이크 컨트롤러에서 본문 좋아요 업데이트하다 오류남');
        console.log(error);
    }
}

exports.PostLikeCheck = async(req,res)=>{
    try {
        const {postId,userId} = req.body;

        const stat = await Stat.findOne({where : {stat_type,postId,userId}});

        res.send(stat);
    } catch (error) {
        console.log('라이크 컨트롤러에서 본문 좋아요 업데이트하다 오류남');
        console.log(error);
    }
}