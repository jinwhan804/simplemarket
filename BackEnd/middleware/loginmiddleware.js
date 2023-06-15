const jwt = require("jsonwebtoken");

exports.isLogin = (req, res, next) => {
    const { access_token } = req.session;
    for (const key in req.sessionStore.sessions) {
        console.log(key)
        console.log(req.sessionStore.sessions[key])

        // req.sessionStore.sessions[key] = JSON.parse(req.sessionStore.sessions[key]);
    }
    console.log(req.sessionStore.sessions);
    // console.log(access_token);
    jwt.verify(access_token, process.env.ACCESS_TOKEN_KEY, (err, acc_decoded) => {
        if (err) {
            res.send("토큰이 만료되었습니다. 다시 로그인 해주세요.")
        } else {
            // console.log(acc_decoded)
            req.access_decoded = acc_decoded;
            next();
        }
    })
}