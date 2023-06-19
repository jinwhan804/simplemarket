const {Post,User} = require('../models');

exports.LocalPostView = async(req,res)=>{
    try {
        const {access_decoded} = req;
        if(access_decoded.id == 1){
            // 관리자일 경우 전체 보기
            await Post.findAll({
                include : {
                    model : User
                },
                order : [['createAt', 'DESC']]
            }).then((e) => {
                res.send(e);
            }).catch((err) => {
                console.log(err);
            })
        }else{
            await Post.findAll({
                include : {
                    model : User,
                    where : {address : access_decoded.address}
                },
                order: [['createdAt', 'DESC']]
            }).then((e) => {
                res.send(e);
            }).catch((err) => {
                console.log(err);
            })            
        }
    } catch (error) {
        console.log('로컬 포스트 컨트롤러에서 전체 글 보여주다 에러남');
        console.log(error);
    }
}