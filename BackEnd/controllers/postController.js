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
        console.log(req.body);
        req.body.pageId = id;
        res.send(`${process.env.FRONT}/detail${process.env.END}`)
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 하나 보여주다 에러남 1');
        console.log(error);
    }
}

exports.PostViewOne = async (req, res) => {
    try {
        const id = req.body.pageId;
        const {access_decoded} = req;

        const post = await Post.findOne({
            where : {id},
            include : {
                model : User
            }
        })

        if(access_decoded.id != post.userId){
            let viewAdd = post.postViews + 1;
            Post.update({postViews : viewAdd},{where : {id}});
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

exports.PostDelete = async(req,res)=>{
    try {
        const id = req.body.data;

        await Post.destroy({
            where : {id}
        })

        const reply = await Reply.findAll({where : {postId : id}});

        await Reply.destroy({
            where : {postId : id}
        })

        reply.forEach(async(el)=>{
            await Rereply.destroy({
                where : {replyId : el.id}
            })
        })

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

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log(error);
    }
}