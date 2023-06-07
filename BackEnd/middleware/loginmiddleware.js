const jwt = require("jsonwebtoken");

exports.isLogin = (req, res, next) => {
    const { access_token } = req.session;
    jwt.verify(access_token, process.env.ACCESS_TOKEN_KEY, (err, acc_decoded) => {
        if(err) {
            res.send("다시 로그인")
        }else{
            console.log(acc_decoded)
            req.access_decoded = acc_decoded;
            next();
        }
    })
}