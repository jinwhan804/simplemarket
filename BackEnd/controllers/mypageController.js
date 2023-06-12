const { User } = require("../models");

exports.nicknameUpdate = async (req, res) => {
    try {
        const {user_id} = req.access_decoded;
        const newNickname = req.body.nickname;

        const user = await User.findOne({where : {user_id}});
        await user.update(
            {nickname : newNickname}
        );
        res.send("nick 수정완료");
    } catch (error) {
        console.log(error);
    }
}