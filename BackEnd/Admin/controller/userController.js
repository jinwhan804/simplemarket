const { User, Join } = require("../model");
const bcrypt = require("bcrypt");

exports.SignUp = async (req, res) => {
    try {
        const { name, age, user_id, user_pw, nickname, gender, address } = req.body;
        const user = await User.findOne({ where: { user_id } });
        const requestUser = await Join.findOne({ where: { user_id } });
        if (user != null && requestUser != null) {
            return res.send("중복 회원 가입 입니다.");
        }
        const hash = bcrypt.hashSync(user_pw, 10);
        await Join.create({
            name,
            age,
            user_id,
            user_pw: hash,
            nickname,
            gender,
            address
        })
        res.redirect("http://127.0.0.1:5500/frontEnd/Admin/login.html")
    } catch (error) {
        console.log(error);
    }
}

exports.Login = async (req, res) => {
    try {
        const { user_id, user_pw } = req.body;
        const user = await User.findOne({ where: { user_id } })
        if (user == null) {
            return res.send("가입 안한 아이디 입니다.");
        }

        const same = bcrypt.compareSync(user_pw, user.user_pw)
        const { name, age } = user;
        if (same) {
            let token = jwt.sign({
                name,
                age
            }, process.env.ACCESS_TOKEN_KEY, {
                expiresIn: "20m"
            });
            req.session.access_token = token;
            return res.redirect("http://127.0.0.1:5500/frontEnd/Admin/main.html")
        } else {
            return res.send("비번 틀림");
        }
    } catch (error) {
        console.log(error);
    }
}