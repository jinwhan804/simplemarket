const { Post, User,Reply,Rereply } = require('../models');
const fs = require("fs");
const path = require("path");
exports.PostViewAll = async (req, res) => {
    try {
        const {access_decoded} = req;

        await Post.findAll({
            include : {
                model : User
            },
            order: [['createdAt', 'DESC']]
        }).then((e) => {
            // 생성되었던 pageId 제거
            function findKeyByToken(obj, pageId) {
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
                        if (parsedObj.pageId === pageId) {
                            // 원하는 값을 찾았다면, 해당 키를 반환합니다.
                            return key;
                        }
                    } else if (typeof obj[key] === "object" && obj[key] !== null) {
                            // 값이 객체일 경우, 재귀적으로 함수를 호출하여 탐색을 계속합니다.
                            const result = findKeyByToken(obj[key], pageId);
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
    
                if(json?.pageInfo){
                    if(!json.pageInfo?.user){
                        th = json.pageInfo.pageId;
                    }                    
                }
            }

            const ta = req.sessionStore.sessions;
            const nowsessioid = findKeyByToken(ta, th); 

            req.sessionStore.all((err, sessions) => {
                if (err) {
                return res.sendStatus(500);
                }
        
                const sessionIds = Object.keys(sessions);

                // Delete each session by ID
                sessionIds.forEach((el) => {
                    if (el == nowsessioid) {
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
            });
            res.send(e);
        }).catch((err) => {
            console.log(err);
        })
    } catch (error) {
        console.log('포스트 컨트롤러에서 전체 글 보여주다 에러남');
        console.log(error);
    }
}

exports.PostViewSelect = (req, res) => {
    try {
        const id = req.body.data;
        const {access_decoded} = req;
        const userMoveInfo = {user : access_decoded, pageId : id};

        req.session.pageInfo = userMoveInfo;

        res.send(`${process.env.FRONT}/detail${process.env.END}`)
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 하나 보여주다 에러남 1');
        console.log(error);
    }
}

exports.PostViewOne = async (req, res) => {
    try {
        const {access_decoded} = req;
        let id;

        for (const key in req.sessionStore.sessions) {
            const json = JSON.parse(`${req.sessionStore.sessions[key]}`);

            if(json.pageInfo?.user){
                if(access_decoded.id == json.pageInfo.user.id){
                    id = json.pageInfo.pageId;
                }
            }
        }

        const post = await Post.findOne({
            where : {id},
            include : {
                model : User
            }
        })

        if(access_decoded.id != post.userId){
            let likeAdd = post.postViews + 1;
            Post.update({postViews : likeAdd},{where : {id}});
        }
        const content = fs.readFileSync(post.content,"utf8");
        post.content = content;
        const data = {posts : post, users : access_decoded};

        res.json(data);
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 하나 보여주다 에러남 2');
        console.log(error);
    }
}

exports.PostInsertView = async (req, res) => {
    try {
        const { access_decoded } = req;
        const user = await User.findOne({
            where : {id : access_decoded.id}
        })
        const data = user.dataValues;
        res.send(data);
    } catch (error) {

    }
}

exports.PostInsert = async (req, res) => {
    try {
        const {title, content, userId} = req.body;
        const pathName = path.join(__dirname, "..","up", Date.now().toString());
        fs.writeFileSync(pathName, content);
        await Post.create({
            title,
            content : pathName,
            userId
        })

        res.send(`${process.env.FRONT}/${process.env.MAIN}`);
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 추가하다가 에러남');
        console.log(error);
    }
}

exports.PostUpdateSelect = (req,res)=>{
    try {
        const id = req.body.data;
        const {access_decoded} = req;
        const userMoveInfo = {user : access_decoded, pageId : id};

        req.session.pageInfo = userMoveInfo;
        
        res.send(`${process.env.FRONT}/update${process.env.END}`);
    } catch (error) {
        console.log('포스트 컨트롤러에서 수정 탭에서 글 하나 보여주다 에러남 1');
        console.log(error);
    }
}

exports.PostUpdate = async(req,res)=>{
    try {
        const {title, content, id} = req.body;
        const pathName = path.join(__dirname, "..", "up", Date.now().toString());
        fs.writeFileSync(pathName, content);
        await Post.update({            
            title,
            content : pathName
        },{
            where : {id}
        })

        req.session.pageId = id;
        
        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log('포스트 컨트롤러에서 수정하다 에러남');
        console.log(error);
    }
}

exports.PostDelete = async(req,res)=>{
    try {
        const id = req.body.data;

        const reply = await Reply.findAll({where : {postId : id}});

        reply.forEach(async(el)=>{
            await Rereply.destroy({where : {replyId : el.id}});
        })

        await Reply.destroy({where : {postId : id}})

        await Post.destroy({
            where : {id}
        });
        
        res.send(`${process.env.FRONT}/${process.env.MAIN}`);
    } catch (error) {
        console.log('포스트 컨트롤러에서 글 지우다 에러남');
        console.log(error);
    }
}

exports.PostLikes = async(req,res)=>{
    try {
        const {id, postLikes} = req.body;
        
        await Post.update({            
            postLikes
        },{
            where : {id}
        })

        req.session.pageId = id;

        res.send(`${process.env.FRONT}/detail${process.env.END}`);
    } catch (error) {
        console.log(error);
    }
}