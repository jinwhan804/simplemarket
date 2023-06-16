const { User } = require("../models");

exports.logout = (req, res) => {
    // console.log(req);
    console.log("로그아웃 컨트롤러에 들어오니>");
    try {
      // 현재 브라우저 토큰값
    //   const th = req.rawHeaders[29].slice(8);
    //   console.log(th);
  
      // 특정 값을 갖는 키를 찾는 함수를 정의합니다.
      function findKeyByToken(obj, token) {
        for (let key in obj) {
          if (typeof obj[key] === "string") {
            let parsedObj;
            try {
              // JSON 문자열을 파싱하여 객체로 변환합니다.
              parsedObj = JSON.parse(obj[key]);
            } catch (err) {
              // 파싱 실패 시에는 다음 키로 이동합니다.
              continue;
            }
            if (parsedObj.access_token === token) {
              // 원하는 값을 찾았다면, 해당 키를 반환합니다.
              return key;
            }
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            // 값이 객체일 경우, 재귀적으로 함수를 호출하여 탐색을 계속합니다.
            const result = findKeyByToken(obj[key], token);
            if (result) {
              return result;
            }
          }
        }
        return null;
      }

        let th;
        for (const key in req.sessionStore.sessions) {
            const json = JSON.parse(`${req.sessionStore.sessions[key]}`);
            th = json.access_token;
        }
        const ta = req.sessionStore.sessions;
        const nowsessioid = findKeyByToken(ta, th); // "aewSIDVHKOMg9OpzsrsCap
  
        // res.clearCookie('mytoken', {path : "/"});
        req.sessionStore.all((err, sessions) => {
            if (err) {
            return res.sendStatus(500);
            }
    
            const sessionIds = Object.keys(sessions);
    
            // Delete each session by ID
            sessionIds.forEach((el) => {
            // if(sessionId) {
            console.log(el);
            console.log(nowsessioid);
            if (el == nowsessioid) {
            // }
                req.sessionStore.destroy(nowsessioid, (err) => {
                    if (err) {
                        console.error("Error destroying session:", err);
                    } else {
                        console.log("Session destroyed successfully:", nowsessioid);
                        console.log(ta);
                    }
                });
            }
        });
        
        res.send("메인 페이지");
        res.sendStatus(200);
      });
    } catch (error) {
      console.log("로그아웃 컨트롤러에서 오류" + error);
    }
  
};
