const { User } = require("../models");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 아이디 비번, 중복된 아이디인지, 비번 검증,
// 맞으면 엑세스토큰 세션이랑 연계해서발급하고 로그인

exports.Login = async (req, res) => {
    try {
        const {user_id, user_pw } = req.body;
        const user = await User.findOne({where: {user_id}})
        if(user == null) {
            return res.send("가입 안한 아이디 입니다.");
        } 
 
        const same = bcrypt.compareSync(user_pw, user.user_pw)
        const { id, name, age, nickname } = user;
        if(same) {
            let token = jwt.sign({
                id,
                name,
                age,
                nickname
            },process.env.ACCESS_TOKEN_KEY,{
                expiresIn : "20m"
            });
            if(user.grade == "1"){
                return res.send("가입 승인 대기중입니다.");
            }
            req.session.access_token = token;
            return res.redirect("http://127.0.0.1:5500/FrontEnd/main.html")
        }else if(!same) {
            return res.send("비밀번호가 맞지 않습니다.");
        }
    } catch (error) {
        console.log(error);
    }
}

exports.viewUser = async (req, res) => {
    const { access_decoded } = req;
    const user = await User.findOne({where : {name : access_decoded.name}});

    res.json(user);
}