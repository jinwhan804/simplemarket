const {Rereply,User,Reply} = require('../models');

exports.RereplyView = async(req,res)=>{
    try {
        const id = req.body.data;
        const rereply = await Rereply.findAll({
            where : {replyId : id},
            include : {
                model : User,
                modle : Reply
            }
        })

        res.json(rereply);
    } catch (error) {
        console.log(error);
    }
}

exports.RereplyInsert = async(req,res)=>{
    try {
        const {content, replyId, userId} = req.body;

        await Rereply.create({
            content,
            replyId,
            userId
        })

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log(error);
    }
}

exports.RereplyUpdate = async(req,res)=>{
    try {
        const {content, id} = req.body;
    
        await Rereply.update({content},{where : {id}})        

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log(error);
    }
}

exports.RereplyDelete = async(req,res)=>{
    try {
        const id = req.body.data;
    
        await Rereply.destroy({where : {id}})

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log(error);
    }
}