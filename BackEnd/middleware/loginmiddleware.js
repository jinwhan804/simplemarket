const jwt = require("jsonwebtoken");

exports.isLogin = (req, res, next) => {
    let access_token;
    console.log(req.sessionStore.sessions);
    for (const key in req.sessionStore.sessions) {
        const json = JSON.parse(`${req.sessionStore.sessions[key]}`);
        
        access_token = json.access_token;        
    }
    console.log("aaaaaaaaaaaaaaa",access_token);
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