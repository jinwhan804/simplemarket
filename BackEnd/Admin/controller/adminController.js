const { User } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// 관리자 로그인 컨트롤러
exports.AdminLogIn = async (req, res) => {
    try {
        const { user_id, user_pw } = req.body;
        const admin = await User.findOne({ where: { user_id } });

        if (!admin) {
            const hashedPW = bcrypt.hashSync(user_pw, 10);
            admin = await User.create({
                user_id: 'admin',
                user_pw: hashedPW, // admin3030
                nickname: '심플관리자',
                name: '관리자',
                grade: '3',
                age: '100'
            });
            res.send('관리자 계정이 생성되었습니다.');
        } else {
            const same = bcrypt.compareSync(user_pw, admin.user_pw);
            const { nickname, grade } = admin;
            if (same) {
                let token = jwt.sign({
                    nickname,
                    grade
                }, process.env.ACCESS_TOKEN_KEY, {
                    expiresIn: '60m'
                })
                req.session.access_token = token;
                return res.redirect('http://127.0.0.1:5500/FrontEnd/Admin/main.html');
            } else {
                res.send('비밀번호 틀림');
            }
        }
    } catch (error) {
        console.log(error);
    }
}


// 유저 회원가입 및 로그인 컨트롤러
exports.SignUp = async (req, res) => {
    try {
        const { name, age, user_id, user_pw, nickname, gender, address, grade } = req.body;
        const user = await User.findOne({ where: { user_id } });
        const requestUser = await User.findOne({ where: { user_id } });
        if (user != null && requestUser != null) {
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
            address,
            grade
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
                age,
                grade
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
