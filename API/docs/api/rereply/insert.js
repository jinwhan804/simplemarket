module.exports = {
  "/rereply/insert": {
    post: {
      tags: ["Rereply"],
      summary: "대댓글 추가",
      description: "게시판 대댓글 추가(content, nickname, userImg, userId)",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              properties: {
                content: {
                  type: "string",
                  description: "작성 글 내용",
                  example: "선제ㄱ",
                },
                nickname:{
                  type : "string",
                  description: "유저 닉네임",
                  example: "usernickname"
                },
                userImg:{
                  type : "string",
                  description: "유저 프로필 사진",
                  example: "c/program/market/userImg/itemimg.png"
                },
                userId: {
                  type: "string",
                  description: "유저 테이블 아이디",
                  example: "1",
                }
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "대댓글 작성 성공",
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
                        example: [{content : "선제ㄱ", 
                                  nickname : "usernickname", 
                                  userImg : "c/program/market/userImg/itemimg.png",
                                  userId : "1"}],
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
