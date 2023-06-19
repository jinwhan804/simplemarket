const {Reply,User,Rereply} =require('../models');

exports.ReplyViewAll = async(req,res)=>{
    try {
        const id = req.body.data;
        const reply = await Reply.findAll({
            where : {postId : id},
            include : {
                model : User
            }
        })

        res.json(reply);
    } catch (error) {
        console.log(error);
    }
}

exports.ReplyInsert = async(req,res)=>{
    try {
        const {content, postId, userId} = req.body;

        await Reply.create({
            content,
            postId,
            userId
        })

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log(error);
    }
}

exports.ReplyUpdate = async(req,res)=>{
    try {
        const {content, id} = req.body;
    
        await Reply.update({content},{where : {id}})        

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log(error);
    }
}

exports.ReplyDelete = async(req,res)=>{
    try {
        const id = req.body.data;

        await Rereply.destroy({where : {replyId : id}});
    
        await Reply.destroy({where : {id}});

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log(error);
    }
}