const { User } = require("../models");

exports.logout = (req, res) => {
    req.session.destroy(function(err){ 
        if(err){
            console.log(err);
        }
        else {
            let access_token = "";
            for (const key in req.sessionStore.sessions) {
                const json = JSON.parse(`${req.sessionStore.sessions[key]}`);
                json.access_token = access_token;
            }
            console.log('bbb',json.access_token);
            res.clearCookie('connect.sid');
            res.send("메인 페이지");
        }
    });
};
