const { Chat } = require('../models');

exports.ChatInsert = async (req, res) => {
    try {
        const { user_id, nickname, message, profile_img, userInfo } = req.body;
        await Chat.create({
            user_id,
            nickname,
            message,
            profile_img,
            userInfo
        })
    } catch (error) {
        console.log(error);
    }
}

exports.ViewAllChats = async (req, res) => {
    try {
        const chats = await Chat.findAll();
        console.log(chats);
        res.json(chats);
    } catch (error) {
        console.log(error);
    }
}
