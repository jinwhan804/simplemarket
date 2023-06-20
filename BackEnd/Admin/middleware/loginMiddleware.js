const jwt = require('jsonwebtoken');

exports.isLogin = (req, res, next) => {
    const { access_token } = rea.session;
    jwt.verify(access_token, process.env.ACCESS_TOKEN_KEY, (err, acc_decoded) => {
        if (err) {
            res.send('다시 로그인 하세요');
        } else {
            req.acc_decoded = acc_decoded;
            next();
        }
    })
}