const { Admin } = require('../model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.LogIn = async (req, res) => {
    try {
        const { admin_id, admin_pw } = req.body;
        let admin = await Admin.findOne({ where: { admin_id } });

        if (admin == null) {
            const hashedPW = bcrypt.hashSync(admin_pw, 10);
            admin = await Admin.create({
                admin_id: 'admin',
                admin_pw: hashedPW, // admin3030
                admin_nickName: '심플관리자'
            });
            res.send('관리자 계정이 생성되었습니다.');
        } else {
            const same = bcrypt.compareSync(admin_pw, admin.admin_pw);
            const { admin_nickName } = admin;
            if (same) {
                let token = jwt.sign({
                    admin_nickName
                }, process.env.ACCESS_TOKEN_KEY, {
                    expiresIn: '60m'
                })
                req.session.access_token = token;
                return res.redirect('http://127.0.0.1:5500/FrontEnd/main.html');
            } else {
                res.send('비밀번호 틀림');
            }
        }
    } catch (error) {
        console.log(error);
    }
}