const { Chat, User } = require('../models');

exports.ChatInsert = async (req, res) => {
    try {
        const { user_id, nickname, message, profile_img, sender, receiver } = req.body;
        await Chat.create({
            user_id,
            nickname,
            message,
            profile_img,
            sender,
            receiver
        })
    } catch (error) {
        console.log(error);
    }
}

exports.ViewAllChats = async (req, res) => {
    const { nickname } = req.params;
    try {
        const chats = await Chat.findAll();
        // console.log(chats);
        res.json(chats);
        console.log(nickname);
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