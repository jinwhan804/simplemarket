const {Posts} = require('../model');

exports.PostViewAll = async(req,res)=>{
    try {
        const posts = await Posts.findAll();
        res.send(posts);
    } catch (error) {
        console.log('포스트 컨트롤러에서 전체 글 보여주다 에러남');
        console.log(error);
    }
}

exports.PostInsert = async(req,res)=>{
    try {
        const {title,content,nickname} = req.body;
        await Posts.create({
            title,
            content,
            nickname
        })

        res.redirect('http://127.0.0.1:5500/post.html');
    } catch (error) {
        
    }
}