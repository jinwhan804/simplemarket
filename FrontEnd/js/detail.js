// 마이페이지 버튼 로그인 됐을때만 보이게
const mypageBtn = document.getElementById('mypage-btn');

async function mypageHide() {
    const { data } = await API.get('/login/view', {
        withCredentials : true
    })
    if(!data.name){
        mypageBtn.style.display = "none";
    }
}

// 로그인 팝업
const loginPopup = document.querySelector('.loginPopup');
const popupLoginBtn = document.getElementById('popup-login');

popupLoginBtn.addEventListener('click', () => {
    if(loginPopup.style.display === "none"){
        loginPopup.style.display = "flex"
    }else{
        loginPopup.style.display = "none"
    }
    
})

// 로그인 버튼 로그인 되어 있을 떄는 안보이게
const loginBtn = document.getElementById('loginBtn');

async function loginBtnHide() {
    const { data } = await API.get('/login/view',{
        withCredentials : true
    })
    if(data.name) {
        popupLoginBtn.style.display = "none";
    }
}

// 쿠키 생성
const setCookie = (cname, cvalue, cexpire) => {
  
    // 만료일 생성 -> 현재에서 30일간으로 생성 -> setDate() 메서드 사용
    let expiration = new Date();
    expiration.setDate(expiration.getDate() + parseInt(cexpire)); // Number()로 처리 가능
  
    // 쿠키 생성하기
    let cookie = '';
    cookie = `${cname}=${cvalue}; path=/;expires=${expiration.toUTCString()};`;
    // console.log(cookie);
  
    // 쿠키 저장하기
    document.cookie = cookie;
};

const delCookie = (cname) => {
    setCookie(cname, '', 0);
};

// 로그아웃 기능
const Logout = document.getElementById('logout');

Logout.addEventListener('click', async () => {
    try {
        const { data } = await API.get("/logout", {
            withCredentials: true,
        });
        if (data.msg == "메인 페이지") {
            delCookie('login');
            window.location.href = `./${mainUrl}`;
            alert("로그아웃 되었습니다.");
        }
    } catch (error) {
        console.log(error);
    }
})

// 로그아웃 버튼 로그인 안되어 있을 때는 안보이게
async function logoutBtnHide() {
    const { data } = await API.get('/login/view', {
        withCredentials : true
    })
    if(!data.name){
        Logout.style.display = "none";
    }
}

mypageHide();
loginBtnHide();
logoutBtnHide();
// -----------------------------------------실시간 채팅------------------------------------------------------

const chatBox = document.querySelector('.chatBox');
const chatList = document.querySelector('.chatList');
const chatBoxClose = document.querySelectorAll('.close_chatBox');
const chatContent = document.querySelector('.chat_content');
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

// 채팅 목록과 채팅 팝업창 함수
async function popup() {
    const { data } = await API.get("/login/view", {
        withCredentials: true
    });
    document.body.classList.toggle('active');
    if (data.grade === '3') {
        chatList.classList.add('active');
    } else {
        chatBox.classList.add('active');
    }
}

// 채팅 목록과 채팅 팝업창 닫는 함수
chatBoxClose.forEach(btn => {
    btn.addEventListener('click', () => {
        chatBox.classList.remove('active');
        chatList.classList.remove('active');
    });
});


// 관리자 계정의 유저 채팅 목록 창
async function selectUserChat() {
    try {
        const response = await API.get('/login/viewAll', {
            withCredentials: true
        });
        console.log(response);
        const users = response.data;
        console.log(users);
        const chatMessages = document.querySelectorAll(`.chat_message`);
        console.log(chatMessages);
        chatMessages.forEach((e, index) => {
            if (users[index]) {
                e.addEventListener('dblclick', () => {
                    const userNickname = users[index].nickname;
                    openChatBox(userNickname);
                });
            }
        })
    } catch (error) {
        console.error(error);
    }
}

function openChatBox(userNickname) {
    chatBox.classList.add('active');
}


// 채팅 소켓
async function userInfo() {
    const response = await API.get('/login/view', {
        withCredentials: true
    });
    console.log(response);
    return {
        nickname: response.data.nickname,
        profileImg: response.data.profile_img,
        userId: response.data.user_id,
        user_info: response.data.id
    };
}

window.onload = async () => {
    try {
        const { nickname, profileImg, userId, user_info } = await userInfo();
        // 유저의 채팅 리스트
        const getChatData = await API.get('/chat/all_chats', {
            withCredentials: true
        });
        console.log(getChatData);
        const chatData = getChatData.data;
        const userChatList = document.querySelector('.user_chat_list');



        // userChatList.innerHTML = chatDataHTML;

        const socket = io.connect(serverUrl);
        socket.on('message', (data) => {
            console.log(data);
            let el;
            if (data.nickname === nickname) {
                el = `
                <div class="content my-message">
                    <p class="message ballon">${data.message}</p>
                    <p class="date">${data.date}</p>
                </div>
                `;
            } else {
                el = `
                <div class="content other-message">
                    <img src="${data.profile_img}">
                    <div class="message-display">
                        <p class="nickname">${data.nickname}</p>
                        <p class="message ballon">${data.message}</p>
                        <p class="date">${data.date}</p>
                    </div>
                </div>
                `;
            }
            chatContent.innerHTML += el;
        })

        chatData.forEach(data => {
            const userInList = userChatList.querySelector(`.chat_message[data_nickname="${data.nickname}"]`);
            console.log(data);
            if (userInList) {
                // 채팅 목록에서 해당 유저가 있으면 목록에 추가하지 않고 메시지만 업데이트
                userInList.querySelector('.message_content').textContent = data.message;
            } else {
                // 리스트에 없으면 추가
                let createdAt = new Date(data.createdAt);
                let hours = createdAt.getHours();
                let minutes = createdAt.getMinutes();

                let newMessageHTML = `
                <div class="chat_message" data_nickname="${data.nickname}">
                    <img src="${data.profile_img}">
                    <p>${data.nickname}: <span class="message_content">${data.message}</span></p>
                    <p>${hours}:${minutes < 10 ? '0' + minutes : minutes}</p>
                </div>
                `;
                userChatList.innerHTML += newMessageHTML;
            }
        });

        selectUserChat();

        btn.onclick = () => {
            const messageData = {
                user_id: userId,
                nickname: nickname,
                message: message.value,
                date: timeString,
                profile_img: profileImg,
                userInfo: user_info
            }
            socket.emit('message', messageData);
            API.post('/chat/chat_insert', messageData, {
                withCredentials: true
            })
        }
    } catch (error) {
        console.log(error);
    }
}

// 회원가입 클릭, 로고 클릭, 마이페이지 버튼 클릭

// const toInsert = document.getElementById('toInsert');

// toInsert.addEventListener ('click', () => {
//     location.href = `./insert${urlEnd}`;
// })

const Logo = document.querySelector('.logo').addEventListener('click', () => {
    location.href = `./${mainUrl}`;
})

mypageBtn.addEventListener('click', () => {
    location.href = `./mypage${urlEnd}`;
})


/////////////////////////////////게시판 영역///////////////////////////////////
let posts = {};
let users = {};
let replys = [];
let likeNum = [];

const updateBtn = document.getElementById('update_btn');
async function GetAPI(){
    try {
        const {data} = await API.get('/post/detail',{
            headers : {
                "Content-Type" : "application/json"
            }
        }) 
        title.value = data.posts.title;
        nickname.value = data.posts.User.nickname;
        contentArea.innerHTML = data.posts.content;
        document.getElementById('userImg').src = data.posts.User.profile_img; // 이미지 추가
                
        posts = data.posts;
        users = data.users;
        
        const form = new FormData();

        form.append('postId', posts.id);
        form.append('userId',users.id);

        // 조회수 추가
        await API.post('/viewcheck/add',form);

        // if(data.users.id != data.posts.userId){
        //     updateBtn.classList.add('unable');
        // }else{
        //     updateBtn.classList.remove('unable');
        // }

        // 좋아요 카운팅
        const likeCount = await API.post('/likecheck/post',{
            data : posts.id
        });

        postLikes.value = likeCount.data.length;  
        
        await API.post('/reply',{
            headers : {
                "Content-Type" : "application/json"
            },
            data : posts.id
        }).then((e)=>{
            replys = e.data;

            reply_list.innerHTML = "";

            let _li = document.createElement('li');
            let _div1 = document.createElement('div');
            let _div2 = document.createElement('div');
            let _div3 = document.createElement('div');
            let _div4 = document.createElement('div');
            _div1.className = 'reply1';
            _div2.className = 'reply2';
            _div3.className = 'reply3';
            _div4.className = 'reply4';

            // _div1.innerHTML = "No.";
            // _div2.innerHTML = "내용";
            // _div3.innerHTML = "작성자";
            // _div4.innerHTML = "시간";
            _li.append(_div1,_div2,_div3,_div4);
            reply_list.append(_li);

            if(e.data == null){
                return;
            }else{
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let nowdate = year.toString();
                
                if(month >= 10){
                    nowdate += month;
                }else{
                    nowdate += '0' + month;
                }

                if(day >= 10){
                    nowdate += day;
                }else{
                    nowdate += '0' + day;
                }

                nowdate = Number(nowdate);

                e.data.forEach(async(el,index) => {
                    let updateDate = Number(el.updatedAt.slice(0,10).split('-').join(''));

                    let _li1 = document.createElement('li');
                    let _div5 = document.createElement('div');
                    let _div6 = document.createElement('div');
                    let _div7 = document.createElement('div');
                    let _div8 = document.createElement('div');
                    let btn1 = document.createElement('button');
                    
                    _li1.style.position = 'relative';
                    _li1.className = 'replyLi';
                    _div5.className = 'reply1';
                    _div6.className = 'reply2';
                    _div7.className = 'reply3';
                    _div8.className = 'reply4';

                    _div5.innerHTML = index + 1;
                    _div6.innerHTML = el.content;
                    _div7.innerHTML = el.User.nickname;
                    btn1.innerHTML = "댓글";
                    
                    if(nowdate > updateDate){
                        _div8.innerHTML = el.updatedAt.slice(0,10);
                    }else{
                        _div8.innerHTML = el.updatedAt.slice(11,19);
                    }

                    _li1.append(_div5,_div6,_div7,_div8,btn1);
                    
                    btn1.onclick = ()=>{
                        let rediv = document.createElement('span');
                        let recontentdiv = document.createElement('span');
                        let rerebtn1 = document.createElement('button');
                        let rerebtn2 = document.createElement('button');
                        
                        rediv.className = 'rereply_area';
                        rediv.style.border = '1px solid';
                        recontentdiv.className = 'rereply_content';
                        recontentdiv.style.border = '1px solid';
                        recontentdiv.contentEditable = true;

                        rerebtn1.innerHTML = '등록';
                        rerebtn2.innerHTML = '취소';

                        rediv.append(recontentdiv,rerebtn1,rerebtn2);
                        
                        rerebtn1.onclick = async()=>{
                            const form = new FormData();

                            form.append('content',recontentdiv.innerHTML);
                            form.append('userId',users.id);
                            form.append('replyId',el.id);
                            
                            _li1.removeChild(rediv);
                            await API.post('/rereply/insert',form).then((e)=>{
                                location.href = e.data;
                            }).catch((err)=>{
                                console.log(err);
                            })
                        }

                        rerebtn2.onclick = ()=>{
                            _li1.removeChild(rediv);
                        }

                        _li1.append(rediv);
                    }

                    if(users.id == el.User.id){
                        let btnsDiv = document.createElement('div');
                        btnsDiv.className = 'btnsDiv';
                        btnsDiv.innerHTML = `
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        `;

                        let btn2 = document.createElement('button');
                        let btn3 = document.createElement('button');
                        let btn4 = document.createElement('button');
                        let btn5 = document.createElement('button');

                        btn2.style.display = 'none';
                        btn3.style.display = 'none';
                        btn4.style.display = 'none';
                        btn5.style.display = 'none';
                        
                        btnsDiv.append(btn2, btn3, btn4, btn5);

                        btnsDiv.onclick = () => {
                            const buttons = [btn2, btn3, btn4, btn5];
                            buttons.forEach(btn => {
                                btn.innerHTML = btn === btn2 ? '수정' :
                                                btn === btn3 ? '삭제' :
                                                btn === btn4 ? '수정확인' : 
                                                '수정취소';
                        
                                btn.style.display = btn.style.display === 'none' ? 'inline-block' : 'none';
                            });
                        };
                        
                       
                        
                        btn2.onclick = ()=>{
                            _div6.contentEditable = true;

                            btn2.classList.add('unable');
                            btn3.classList.add('unable');
                            btn4.classList.remove('unable');
                            btn5.classList.remove('unable');
                        }
                        
                        btn3.onclick = async()=>{
                            try {
                                if(confirm('정말 삭제하시겠습니까?')){
                                    await API.post('/reply/delete',{
                                        data : el.id
                                    }).then((e)=>{
                                        location.href = e.data;
                                    }).catch((err)=>{
                                        console.log(err);
                                    })
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }

                        btn4.onclick = async()=>{
                            _div6.contentEditable = false;

                            btn2.classList.remove('unable');
                            btn3.classList.remove('unable');
                            btn4.classList.add('unable');
                            btn5.classList.add('unable');

                            const form = new FormData();

                            form.append('id', el.id);
                            form.append('content',_div6.innerHTML);

                            await API.post('/reply/update',form).then((e)=>{
                                location.href = e.data;
                            }).catch((err)=>{
                                console.log(err);
                            })
                        }
                        
                        btn5.onclick = ()=>{
                            _div6.contentEditable = false;

                            _div6.innerHTML = el.content;

                            btn2.classList.remove('unable');
                            btn3.classList.remove('unable');
                            btn4.classList.add('unable');
                            btn5.classList.add('unable');
                        }

                        btn4.classList.add('unable');
                        btn5.classList.add('unable');


                        _li1.append(btn3,btn2,btn4,btn5,btnsDiv);
                    }
                    reply_list.append(_li1);

                    _li1.style.position = 'relative'; // _li1 요소에 position: relative; 추가
                    

                    await API.post('/rereply',{
                        data : el.id
                    }).then((e)=>{
                        if(e.data == null){
                            return;
                        }else{
                            let date = new Date();
                            let year = date.getFullYear();
                            let month = date.getMonth() + 1;
                            let day = date.getDate();
                            let nowdate = year.toString();
                            
                            if(month >= 10){
                                nowdate += month;
                            }else{
                                nowdate += '0' + month;
                            }
                
                            if(day >= 10){
                                nowdate += day;
                            }else{
                                nowdate += '0' + day;
                            }
                
                            nowdate = Number(nowdate);
                            
                            e.data.forEach((el,index) => {
                                
                                let updateDate = Number(el.updatedAt.slice(0,10).split('-').join(''));
                                
                                let _li2 = document.createElement('li');
                                let _rediv1 = document.createElement('div');
                                let _rediv2 = document.createElement('div');
                                let _rediv3 = document.createElement('div');
                                let _rediv4 = document.createElement('div');
                                let rebtn1 = document.createElement('button');
                                
                                _li2.className = 'rereplyLi';
                                _rediv2.className = 'reply2';
                                _rediv3.className = 'reply3';
                                _rediv4.className = 'reply4';
                
                                // _rediv1.innerHTML = index + 1;
                                _rediv2.innerHTML = ">RE : " + el.content;
                                _rediv3.innerHTML = el.User.nickname;
                                rebtn1.innerHTML = "댓글";
                                
                                if(nowdate > updateDate){
                                    _rediv4.innerHTML = el.updatedAt.slice(0,10);
                                }else{
                                    _rediv4.innerHTML = el.updatedAt.slice(11,19);
                                }
                
                                _li2.append(_rediv1,_rediv2,_rediv3,_rediv4,rebtn1);

                                rebtn1.onclick = ()=>{
                                    let rediv = document.createElement('span');
                                    let recontentdiv = document.createElement('span');
                                    let rerebtn1 = document.createElement('button');
                                    let rerebtn2 = document.createElement('button');
                                    
                                    rediv.className = 'rereply_area';
                                    rediv.style.border = '1px solid';
                                    recontentdiv.className = 'rereply_content';
                                    recontentdiv.style.border = '1px solid';
                                    recontentdiv.contentEditable = true;
            
                                    rerebtn1.innerHTML = '등록';
                                    rerebtn2.innerHTML = '취소';
            
                                    rediv.append(recontentdiv,rerebtn1,rerebtn2);
                                    
                                    rerebtn1.onclick = async()=>{
                                        const form = new FormData();
            
                                        form.append('content',recontentdiv.innerHTML);
                                        form.append('userId',users.id);
                                        form.append('replyId',el.id);
                                        
                                        _li2.removeChild(rediv);
                                        await API.post('/rereply/insert',form).then((e)=>{
                                            location.href = e.data;
                                        }).catch((err)=>{
                                            console.log(err);
                                        })
                                    }
            
                                    rerebtn2.onclick = ()=>{
                                        _li2.removeChild(rediv);
                                    }
            
                                    _li2.append(rediv);
                                }
                                
                                if(users.id == el.User.id){
                                    let rebtnsDiv = document.createElement('div');
                                    rebtnsDiv.className = 'rebtnsDiv';
                                    rebtnsDiv.innerHTML = `
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    `;

                                    let rebtn2 = document.createElement('button');
                                    let rebtn3 = document.createElement('button');
                                    let rebtn4 = document.createElement('button');
                                    let rebtn5 = document.createElement('button');

                                    rebtn2.style.display = 'none';
                                    rebtn3.style.display = 'none';
                                    rebtn4.style.display = 'none';
                                    rebtn5.style.display = 'none';

                                    rebtnsDiv.append(rebtn2,rebtn3,rebtn4,rebtn5);

                                    rebtnsDiv.onclick = () => {
                                        const buttons = [rebtn2, rebtn3, rebtn4, rebtn5];
                                        buttons.forEach(rebtn => {
                                            btn.innerHTML = rebtn === rebtn2 ? '수정':
                                                            rebtn === rebtn3 ? '삭제':
                                                            rebtn === rebtn4 ? '수정확인':
                                                            '수정취소';
                                                            
                                            rebtn.style.display = rebtn.style.display === 'none' ? 'inline-block' : 'none';
                                        });
                                    };
                                
                
                                    rebtn2.innerHTML = '수정';
                                    rebtn3.innerHTML = '삭제';
                
                                    rebtn4.innerHTML = '수정확인';
                                    rebtn5.innerHTML = '수정취소';
                
                                    
                                    rebtn2.onclick = ()=>{
                                        _rediv2.contentEditable = true;
                
                                        rebtn2.classList.add('unable');
                                        rebtn3.classList.add('unable');
                                        rebtn4.classList.remove('unable');
                                        rebtn5.classList.remove('unable');
                                    }
                                    
                                    rebtn3.onclick = async()=>{
                                        try {
                                            if(confirm('정말 삭제하시겠습니까?')){
                                                await API.post('/rereply/delete',{
                                                    data : el.id
                                                }).then((e)=>{
                                                    location.href = e.data;
                                                }).catch((err)=>{
                                                    console.log(err);
                                                })
                                            }
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }
                
                                    rebtn4.onclick = async()=>{
                                        _rediv2.contentEditable = false;
                
                                        rebtn2.classList.remove('unable');
                                        rebtn3.classList.remove('unable');
                                        rebtn4.classList.add('unable');
                                        rebtn5.classList.add('unable');
                
                                        const form = new FormData();
                
                                        form.append('id', el.id);
                                        form.append('content',_rediv2.innerHTML);
                
                                        await API.post('/rereply/update',form).then((e)=>{
                                            location.href = e.data;
                                        }).catch((err)=>{
                                            console.log(err);
                                        })
                                    }
                                    
                                    rebtn5.onclick = ()=>{
                                        _rediv2.contentEditable = false;
                
                                        _rediv2.innerHTML = el.content;
                
                                        rebtn2.classList.remove('unable');
                                        rebtn3.classList.remove('unable');
                                        rebtn4.classList.add('unable');
                                        rebtn5.classList.add('unable');
                                    }
                
                                    rebtn4.classList.add('unable');
                                    rebtn5.classList.add('unable');
                
                
                                    _li2.append(rebtn3,rebtn2,rebtn4,rebtn5,rebtnsDiv);
                                    
                                }
                                
                                _li1.append(_li2);

                                _li2.style.position = 'relative'
                                
                                
                                
                            });
                        }
                    }).catch((err)=>{
                        console.log(err);
                    })
                });
            }
        }).catch((err)=>{
            console.log(err);
        })

        
    } catch (error) {
        console.log(error);
    }
}

GetAPI();

toUpdate.onclick = async()=>{
    try {
        await API.post('/post/updateview',{
            headers : {
                "Content-Type" : "application/json"
            },
            data : posts.id
        }).then((e)=>{
            location.href = e.data;
        }).catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
}

toDelete.onclick = async()=>{
    try {
        if(confirm('정말 삭제하시겠습니까?')){
            await API.post('/post/delete',{
                headers : {
                    "Content-Type" : "application/json"
                },
                data : posts.id
            }).then((e)=>{
                location.href = e.data;
            }).catch((err)=>{
                console.log(err);
            })
        }
    } catch (error) {
        console.log(error);
    }
}

// 좋아요 버튼 기능
likeBtn.onclick = async()=>{
    try {
        const form = new FormData();

        form.append('postId',posts.id);
        form.append('userId',users.id);

        await API.post('/likecheck/post/add',form).then((e)=>{
            location.href = e.data;
        }).catch((err)=>{
            console.log(err);
        })
        
    } catch (error) {
        console.log(error);
    }
}

// 댓글 달기
reply_on.onclick = async()=>{
    try {
        const form = new FormData();

        form.append('content', write_reply.innerHTML);
        form.append('userId', users.id);
        form.append('postId', posts.id);

        await API.post('/reply/insert',form).then((e)=>{
            location.href = e.data;
        }).catch((err)=>{
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

toPost.onclick = ()=>{
    location.href = `./${mainUrl}`;
}

// 전체 글 목록 페이지로 이동 = 메인 페이지
const usedMarket = document.querySelector('.used-market');

usedMarket.onclick= ()=>{
    location.href = `./${mainUrl}`;
}

// 동네 장터 이동
const localMarket = document.querySelector('.local-market');

localMarket.onclick = ()=>{
    location.href = `./local${urlEnd}`;
}

// 통계 페이지 이동
const postStat = document.querySelector('.post-stat');

postStat.onclick = ()=>{
    location.href = `./statistic${urlEnd}`;
}