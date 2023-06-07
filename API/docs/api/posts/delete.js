module.exports = {
    "/posts/delete:id": {
        get: {
            tags: ["Post"],
            summary: "게시판 글 제거",
            description: "게시판 글 제거",
            responses: {
                201: {
                    description: "게시판 글 제거 성공",
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
                                                example: [],
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