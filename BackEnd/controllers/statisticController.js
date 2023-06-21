const {Stat,Post,User} = require('../models');

exports.PostStatistic = async(req,res)=>{
    try {
        const id = req.body.data;

        const views = await Stat.findAll({
            where : {stat_type : 'postView',postId : id},
            include : [
                {model : Post},
                {model : User}
            ]
        })
        
        const likes = await Stat.findAll({
            where : {stat_type : 'postLike',postId : id},
            include : [
                {model : Post},
                {model : User}
            ]
        })

        const data = {views,likes};

        res.send(data);
    } catch (error) {
        console.log('스테틱 컨트롤러에서 포스트 뷰랑 좋아요 데이터 보내주다 에러남');
        console.log(error);
    }
}

exports.PostData = async(req,res)=>{
    try {
        const posts = await Post.findAll({
            include : {model : User}
        });

        res.send(posts);
    } catch (error) {
        console.log('스테틱 컨트롤러에서 포스트 데이터 보내주다 에러남');
        console.log(error);
    }
}