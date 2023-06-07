const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.SignUp = async (req, res) => {
    try {
        const { name, age, user_id , user_pw, nickname, gender, address } = req.body;
        const user = await User.findOne({where:{user_id}});
        if(user != null) {
            return res.send("중복 회원 가입 입니다.");
        }
        const hash = bcrypt.hashSync(user_pw , 10);
        await User.create({
            name,
            age,
            user_id,
            user_pw : hash,
            nickname,
            gender,
            address
        })
        res.redirect("http://127.0.0.1:5500/frontEnd/login.html")
    } catch (error) {
        console.log(error);
    }
}