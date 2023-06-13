const {Reply} =require('../models');

exports.ReplyViewAll = async(req,res)=>{
    try {
        const id = req.body.data;
        const reply = await Reply.findAll({
            include : {
                model : Post,
                where : {id}
            }
        })

        res.json(reply);
    } catch (error) {
        console.log(error);
    }
}