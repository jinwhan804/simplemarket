const { Chat, User } = require('../models');

exports.ChatInsert = async (req, res) => {
    try {
        const { message, sender, receiver } = req.body;
        await Chat.create({
            message,
            sender,
            receiver
        })
    } catch (error) {
        console.log(error);
    }
}

exports.ViewAllChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({
            include:
            {
                model: User,
                // attributes: ['id', 'nickname', 'profile_img']
            }

        });
        res.json(chats);
    } catch (error) {
        console.log(error);
    }
}

exports.viewOneChat = async (req, res) => {
    try {
        const {access_decoded} = req;
        const user = req.body;
        console.log(user)

        const comeChat = await Chat.findAll({
            where: { sender : user.id, receiver : access_decoded.nickname },
            include: [{
                model: User
            }],
            order : ['createdAt','DESC']
        });

        const goChat = await Chat.findAll({
            where: { receiver : user.nickname, sender : access_decoded.id },
            include: [{
                model: User
            }],
            order : ['createdAt','DESC']
        });

        let chatData;

        if(comeChat[0].id > goChat[0].id){
            chatData = comeChat[0];
        }else{
            chatData = goChat[0];
        }
        

        res.send(chatData);
    } catch (error) {
        console.error(error);
    }
}