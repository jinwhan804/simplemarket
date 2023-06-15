const { User } = require("../models");

exports.logout = (req, res) => {
    req.session.destroy(function(err){ 
        if(err){
            console.log(err);
        }
        else {
            res.clearCookie('connect.sid');
            res.send("메인 페이지");
        }
    });
};
