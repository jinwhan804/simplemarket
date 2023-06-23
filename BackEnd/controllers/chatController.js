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
        const {user} = req.body;

        const comeChat = await Chat.findAll({
            where: { sender : user[0].id, receiver : access_decoded.nickname },
            include: [{
                model: User
            }],
            order : [['createdAt','DESC']]
        });

        console.log(comeChat[0])

        res.send(comeChat[0]);
    } catch (error) {
        console.error(error);
    }
}