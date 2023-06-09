const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.SignUp = async (req, res) => {
    try {
        const { name, age, user_id, user_pw, nickname, gender, grade, address } = req.body;
        const user = await User.findOne({ where: { user_id } });
        if (user != null) {
            return res.send("중복 회원 가입 입니다.");
        }
        const hash = bcrypt.hashSync(user_pw, 10);
        await User.create({
            name,
            age,
            user_id,
            user_pw: hash,
            nickname,
            gender,
            grade,
            address
        })
        // 로컬에서 사용할때 FRONT 뒤에 _SERVER 제거
        res.redirect(`${process.env.FRONT_SERVER}/${process.env.MAIN}`);
    } catch (error) {
        console.log(error);
    }
}