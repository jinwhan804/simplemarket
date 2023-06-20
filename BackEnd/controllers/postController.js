const { Post, User,Reply,Rereply } = require('../models');

exports.PostViewAll = async (req, res) => {
    try {
        await Post.findAll({
            include : {
                model : User
            },
            order: [['createdAt', 'DESC']]
        }).then((e) => {            
            res.send(e);
        }).catch((err) => {
            console.log(err);
        })
    } catch (error) {
        console.log('포스트 컨트롤러에서 전체 글 보여주다 에러남');
        console.log(error);
    }
}

exports.PostViewSelect = (req, res) => {
    try {
        const id = req.body.data;
        req.session.pageId = id;
        res.send(`${process.env.FRONT}/detail${process.env.END}`)
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 하나 보여주다 에러남 1');
        console.log(error);
    }
}

exports.PostViewOne = async (req, res) => {
    try {
        const {access_decoded} = req;
        const id = req.pageId;        

        const post = await Post.findOne({
            where : {id},
            include : {
                model : User
            }
        })

        if(access_decoded.id != post.userId){
            let likeAdd = post.postViews + 1;
            Post.update({postViews : likeAdd},{where : {id}});
        }
        
        const data = {posts : post, users : access_decoded};

        res.json(data);
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 하나 보여주다 에러남 2');
        console.log(error);
    }
}

exports.PostInsertView = async (req, res) => {
    try {
        const { access_decoded } = req;
        const user = await User.findOne({
            where : {id : access_decoded.id}
        })
        const data = user.dataValues;
        res.send(data);
    } catch (error) {

    }
}

exports.PostInsert = async (req, res) => {
    try {
        const {title, content, userId} = req.body;
        await Post.create({
            title,
            content,
            userId
        })

        res.send(`${process.env.FRONT}/${process.env.MAIN}`);
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 추가하다가 에러남');
        console.log(error);
    }
}

exports.PostUpdateSelect = (req,res)=>{
    try {
        const id = req.body.data;
        req.session.pageId = id;
        res.send(`${process.env.FRONT}/update${process.env.END}`);
    } catch (error) {
        console.log('포스트 컨트롤러에서 수정 탭에서 글 하나 보여주다 에러남 1');
        console.log(error);
    }
}

exports.PostUpdate = async(req,res)=>{
    try {
        const {title, content, id} = req.body;
        
        await Post.update({            
            title,
            content
        },{
            where : {id}
        })

        req.session.pageId = id;
        
        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log('포스트 컨트롤러에서 수정하다 에러남');
        console.log(error);
    }
}

exports.PostDelete = async(req,res,next)=>{
    try {
        const id = req.body.data;

        const reply = await Reply.findAll({where : {postId : id}});

        reply.forEach(async(el)=>{
            await Rereply.destroy({where : {replyId : el.id}});
        })

        await Reply.destroy({where : {postId : id}})

        await Post.destroy({
            where : {id}
        });
        
        res.send(`${process.env.FRONT}/${process.env.MAIN}`);
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 지우다 에러남');
        console.log(error);
    }
}

exports.PostLikes = async(req,res)=>{
    try {
        const {id, postLikes} = req.body;
        
        await Post.update({            
            postLikes
        },{
            where : {id}
        })

        req.session.pageId = id;

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log(error);
    }
}