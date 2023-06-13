const { User } = require("../models");

exports.nicknameUpdate = async (req, res) => {
    try {
        // const {user_id} = req.access_decoded;
        const newNickname = req.body.nickname;
        const { access_decoded } = req;

        const user = await User.findOne({ where: { name: access_decoded.name } });
        await user.update(
            {nickname : newNickname}
        );
        res.send("nick 수정완료");
    } catch (error) {
        console.log(error);
    }
}