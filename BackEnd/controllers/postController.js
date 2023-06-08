const {Post,User} = require('../models');

exports.PostViewAll = async(req,res)=>{
    try {
        const posts = await Post.findAll();
        res.send(posts);
    } catch (error) {
        console.log('포스트 컨트롤러에서 전체 글 보여주다 에러남');
        console.log(error);
    }
}

exports.PostViewOne = async(req,res)=>{
    try {
        const {access_decoded} = req;        
        res.json(access_decoded);
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 하나 보여주다 에러남');
        console.log(error);
    }
}

exports.PostInsertView = async(req,res)=>{
    try {        
        const {access_decoded} = req;
        const user = await User.findOne({
            where : {user_id : access_decoded.user_id}
        })
        const data = user.dataValues;
        console.log(data)
        res.send(data);        
    } catch (error) {
        
    }
}

exports.PostInsert = async(req,res)=>{
    try {
        const {title,content,userId} = req.body;
        console.log(req);
        await Post.create({
            title,
            content,
            userId
        })

        res.redirect('http://127.0.0.1:5500/FrontEnd/post.html');
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 추가하다가 에러남');
        console.log(error);
    }
}