module.exports = {
    "/posts/detail:id": {
        get: {
            tags: ["Post"],
            summary: "게시판 글 하나 보기",
            description: "게시판 글 하나 보기",
            responses: {
                201: {
                    description: "전체 글 하나 보기 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: {
                                    type: "object",
                                        properties: {
                                            code: {
                                                type: "number",
                                                description: "code",
                                                example: 201,
                                            },
                                            message: {
                                                type: "string",
                                                description: "성공 메시지",
                                                example: "success",
                                            },
                                            data: {
                                                type: "array",
                                                description: "data",
                                                example: [{title : "폰 팔아요",
                                                    content : "이걸 안사?", 
                                                    nickname : "usernickname", 
                                                    userImg : "c/program/market/userImg/itemimg.png",
                                                    userId : "1", 
                                                    image : "c/program/market/img/itemimg.png"}
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};