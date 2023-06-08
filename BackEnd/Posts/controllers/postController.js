const {Post} = require('../model');

exports.PostViewAll = async(req,res)=>{
    try {
        const posts = await Post.findAll();
        res.send(posts);
    } catch (error) {
        console.log('포스트 컨트롤러에서 전체 글 보여주다 에러남');
        console.log(error);
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