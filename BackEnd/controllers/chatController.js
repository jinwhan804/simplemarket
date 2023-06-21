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
    console.log(req.body);
    try {
        if (!req.params.nickname) {
            return res.status(400).json({ error: 'Missing user nickname.' });
        }

        const userWithChats = await User.findOne({
            where: { nickname: req.params.nickname },
            include: [{
                model: Chat,
                required: false,
            }]
        });
        console.log(userWithChats);
        res.send(userWithChats);
    } catch (error) {
        console.error(error);
    }
}