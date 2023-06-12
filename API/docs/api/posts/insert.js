module.exports = {
  "/posts/insert": {
    post: {
      tags: ["Post"],
      summary: "게시판 글 추가",
      description: "게시판 글 추가(title, content, nickname, userImg, userId, image)",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              properties: {
                title: {
                  type: "string",
                  description: "작성 글 제목",
                  example: "폰 팔아요",
                },
                content: {
                  type: "string",
                  description: "작성 글 내용",
                  example: "이걸 안사?",
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
                },
                image: {
                  type: "string",
                  description: "작성글에 대한 이미지 파일",
                  example: "c/program/market/img/itemimg.png"
                }
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "글 작성 성공",
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
                                  image : "c/program/market/img/itemimg.png"}],
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
