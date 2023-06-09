const { User } = require("../models");

// exports.logout = (req, res) => {
//     req.session.destroy(function(){ 
//         res.redirect('http://127.0.0.1:5500/frontEnd/login.html');
//     });
// };
// exports.logout = (req, res) => {
//     const { session } = req.session
//     session.destroy(function(err){ 
//         if(err){
//             console.log(err);
//         }
//         else {
//             res.redirect('http://127.0.0.1:5500/frontEnd/login.html');
//         }
//     });
// };
exports.logout = (req, res) => {
    req.session.destroy(function(err){ 
        if(err){
            console.log(err);
        }
        else {
            res.clearCookie('connect.sid');
            res.send("로그인 페이지");
        }
    });
};