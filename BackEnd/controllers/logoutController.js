const { User } = require("../models");

exports.logout = (req, res) => {
    req.session.destroy(function(err){ 
        if(err){
            console.log(err);
        }
        else {
            const token = '';
            for (const key in req.sessionStore.sessions) {
                let json = JSON.parse(`${req.sessionStore.sessions[key]}`);
                json.access_token = token;                
            }
            console.log(req.sessionStore.sessions);
            
            res.clearCookie('connect.sid');
            res.send("메인 페이지");
        }
    });
};
