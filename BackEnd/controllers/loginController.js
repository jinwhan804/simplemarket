const { User } = require("../models");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 아이디 비번, 중복된 아이디인지, 비번 검증,
// 맞으면 엑세스토큰 세션이랑 연계해서발급하고 로그인

exports.Login = async (req, res) => {
    try {
        const { user_id, user_pw } = req.body;
        let user = await User.findOne({ where: { user_id } });

        const same = bcrypt.compareSync(user_pw, user.user_pw)
        const { id, name, age, grade, nickname } = user;
        const data = {msg : '', token : null};
        if (same) {
            let token = jwt.sign({
                id,
                name,
                age,
                grade,
                nickname
            }, process.env.ACCESS_TOKEN_KEY, {
                expiresIn: "20m"
            });

                
            if (user.grade === '0') {
                data.msg = `승인이 거절되었습니다.\n회원가입을 다시 진행해주세요.`;
                return res.send(data);
            } else if (user.grade === '1') {
                data.msg = '가입 승인 대기중입니다.';
                return res.send(data);
            }
            
            req.session.access_token = token;
            data.msg = '로그인 성공';
            data.token = token;
            return res.send(data);
        } else {
            data.msg = `비번 틀림`;
            return res.send(data);
        }
    } catch (error) {
        console.log(error);
    }
}


exports.viewUser = async (req, res) => {
    const { access_decoded } = req;
    // console.log(access_decoded);
    const user = await User.findOne({ where: { name: access_decoded.name } });
    // console.log(user);
    res.json(user);
}

exports.viewAll = async (req, res) => {
    const users = await User.findAll({});
    res.json(users);
}