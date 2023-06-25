// cookie 값 설정
let _cookie = document.cookie;
_cookie = _cookie.replace("login=", "");

// 마이페이지 버튼 로그인 됐을때만 보이게
const mypageBtn = document.getElementById('mypage-btn');

async function mypageHide() {
    const { data } = await API.post('/login/view', {
        cookie: _cookie
    })
    if (!data.name) {
        mypageBtn.style.display = "none";
    }
}

// 로그인 팝업
const loginPopup = document.querySelector('.loginPopup');
const popupLoginBtn = document.getElementById('popup-login');

popupLoginBtn.addEventListener('click', () => {
    if (loginPopup.style.display === "none") {
        loginPopup.style.display = "flex"
    } else {
        loginPopup.style.display = "none"
    }

})

// 로그인 버튼 로그인 되어 있을 떄는 안보이게
const loginBtn = document.getElementById('loginBtn');

async function loginBtnHide() {
    const { data } = await API.post('/login/view', {
        cookie: _cookie
    })
    if (data.name) {
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
        const { data } = await API.post("/logout", {
            cookie: _cookie
        });
        if (data == "메인 페이지") {
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
    const { data } = await API.post('/login/view', {
        cookie: _cookie
    })
    if (!data.name) {
        Logout.style.display = "none";
    }
}

mypageHide();
loginBtnHide();
logoutBtnHide();
// -----------------------------------------실시간 채팅------------------------------------------------------

const chatBox = document.querySelector('.chatBox');
const chatList = document.querySelector('.chatList');
const userChatList = document.querySelector('.user_chat_list');
const chatBoxClose = document.querySelectorAll('.close_chatBox');
const chatContent = document.querySelector('.chat_content');
const back = document.querySelector('.back');



// 채팅 목록과 채팅 팝업창 함수
async function popup() {
    try {
        const { data } = await API.post("/login/view", {
            cookie: _cookie
        });

        document.body.classList.toggle('active');
        if (data.grade === '3') {
            chatList.classList.add('active');
        } else {
            chatBox.classList.add('active');
        }
    } catch (error) {
        console.error(error);
    }
}

// 채팅 목록과 채팅 팝업창 close 이벤트
chatBoxClose.forEach(btn => {
    btn.addEventListener('click', () => {
        chatBox.classList.remove('active');
        chatList.classList.remove('active');
    });
});

window.onload = async () => {
    const { data } = await API.post('/login/view', {
        cookie: _cookie
    });

    const socket = io.connect(serverUrl);
    const nickname = data.nickname;

    if (data.grade === '2') {
        const chatImg = document.querySelector('.chatImg');
        chatImg.addEventListener('click', () => {
            socket.emit('joinRoom', nickname, { id: data.id, nickname: data.nickname });
            // if (sessionStorage.getItem(`${data.nickname}_joined`) === null) {
            //     sessionStorage.setItem(`${data.nickname}_joined`, 'false');
            // }
        })
    }

    const users = await API.post('/login/viewAll', {
        cookie: _cookie
    });
    const userData = users.data;
    console.log(userData);
    const admin = userData[0];
    console.log(admin);

    localStorage.setItem('joined', 'false');

    socket.on('joinRoom', (room, user, userList) => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

        if (localStorage.getItem('joined') === 'false') {
            if (user.id !== admin.id) {
                const welcomeMessage = `
                <div class="content other-message">
                    <img src="${admin.profile_img}">
                    <div class="message-display">
                        <p class="nickname">${admin.nickname}</p>
                        <p class="message ballon">안녕하세요! 심플마켓입니다. 문의를 남겨주시면 신속하게 답변 드리겠습니다😊</p>
                        <p class="date">${timeString}</p>
                    </div>
                </div>
                `
                chatContent.innerHTML += welcomeMessage;
            }
        }
        localStorage.setItem('joined', 'true');
    })

    // 유저들의 채팅 목록을 나타내는 이벤트(관리자만 보임)
    try {
        const response = await API.get('/chat/all_chats', {
            withCredentials: true
        });
        const chats = response.data;
        console.log(chats);

        chats.forEach(chat => {
            console.log(chat);
            let chatUser = chat.User;
            console.log(chatUser);

            if (chatUser.grade === '3') {
                return;
            }

            let createdAt = new Date(chatUser.createdAt);
            let hours = createdAt.getHours();
            let minutes = createdAt.getMinutes();

            const userInList = userChatList.querySelector(`.chat_message[data_nickname="${chatUser.nickname}"]`);
            console.log(userInList);
            let profileImg;
            if (chatUser.profile_img == null) {
                profileImg = "https://simplemarket2.s3.ap-northeast-2.amazonaws.com/defaultprofile.png"; // 디폴트 이미지 URL로 대체
            } else {
                profileImg = chatUser.profile_img;
            }

            if (userInList) {
                // 채팅 목록에서 해당 유저가 있으면 목록에 추가하지 않고 메시지만 업데이트
                userInList.querySelector('.message_content').textContent = chatUser.message;
            } else {
                // 리스트에 없으면 추가
                let newMessageHTML = `
                <div class="chat_message" data_nickname="${chatUser.nickname}">
                    <img src="${profileImg}">
                    <div class="user_chatPart">
                        <div class="user_nick_date">
                            <p class="user_nickname">${chatUser.nickname}</p>
                            <p class="user_time">${hours}:${minutes < 10 ? '0' + minutes : minutes}</p>
                        </div>
                        <p class="message_content">${chat.message}</p>
                    </div>
                </div>
                `;
                userChatList.innerHTML += newMessageHTML;
            }
        })
    } catch (error) {
        console.log(error);
    }

    let receiverUser = null;
    userChatList.querySelectorAll('.chat_message').forEach(item => {
        item.addEventListener('dblclick', async () => {
            const nickname = item.getAttribute('data_nickname');
            chatBox.classList.add('active');
            chatList.classList.remove('active');
            console.log(`${nickname}방 입장`);
            receiverUser = userData.filter((i) => {
                return i.nickname == nickname;
            });

            console.log(receiverUser);



            if (data.grade === '3') {
                // room = nickname;
                socket.emit('joinRoom', nickname, { id: data.id, nickname: data.nickname });

                const beforeChat = await API.post('/chat/chatStory', {
                    user: receiverUser,
                    cookie: _cookie
                })
                const chat = beforeChat.data;

                const now = new Date(chat.createdAt);
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

                let profileImg;
                if (chat.User.profile_img == null) {
                    profileImg = "https://simplemarket2.s3.ap-northeast-2.amazonaws.com/defaultprofile.png"; // 디폴트 이미지 URL로 대체
                } else {
                    profileImg = chatUser.profile_img;
                }

                let beforMessage = `
                    <div class="content other-message">
                        <img src="${profileImg}">
                        <div class="message-display">
                            <p class="nickname">${chat.User.nickname}</p>
                            <p class="message ballon">${chat.message}</p>
                            <p class="date">${timeString}</p>
                        </div>
                    </div>
                `;

                chatContent.innerHTML += beforMessage;
            }
        });
    });


    // 메시지 보내는 이벤트
    const msg = document.getElementById('msg');
    const btn = document.getElementById('btn');

    const sendMessage = async () => {
        try {
            if (msg.value.trim() === '') return;

            const messageData = {
                nickname: data.nickname,
                message: msg.value,
                sender: data.id,
                profile_img: data.profile_img,
                receiver: data.grade === '2' ? admin.nickname : receiverUser[0].nickname,
                cookie: _cookie
            }
            if (data.grade === '3') {
                socket.emit('chat', receiverUser[0].nickname, messageData);
            } else
                socket.emit('chat', nickname, messageData);
            msg.value = '';
            await API.post('/chat/chat_insert', messageData, {
                withCredentials: true
            })
        } catch (error) {
            console.log(error);
        }
    }

    btn.onclick = sendMessage;
    msg.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    })

    msg.addEventListener('input', () => {
        if (msg.value.trim() === '') {
            btn.style.backgroundColor = '#e2e1e1';
        } else {
            btn.style.backgroundColor = '#abc8f8';
        }
    });


    socket.on('chat', (data) => {
        console.log(data);
        console.log(nickname)

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        let profileImg;
        if (data.profile_img == null) {
            profileImg = "https://simplemarket2.s3.ap-northeast-2.amazonaws.com/defaultprofile.png"; // 디폴트 이미지 URL로 대체
        } else {
            profileImg = data.profile_img;
        }

        let el;
        if (data.nickname === nickname) {
            el = `
            <div class="content my-message">
                <p class="message ballon">${data.message}</p>
                <p class="date">${timeString}</p>
            </div>
            `;
        } else {
            el = `
            <div class="content other-message">
                <img src="${profileImg}">
                <div class="message-display">
                    <p class="nickname">${data.nickname}</p>
                    <p class="message ballon">${data.message}</p>
                    <p class="date">${timeString}</p>
                </div>
            </div>
            `;

        }
        chatContent.innerHTML += el;
    })

    // chatBox 창의 뒤로가기 버튼(관리자만 보임)
    try {
        if (data.grade === '3') {
            back.style.backgroundImage = "url(https://simplemarket2.s3.ap-northeast-2.amazonaws.com/my-removebg-preview.png)";
            back.style.cursor = 'pointer';
        } else {
            back.style.backgroundImage = 'none';
            back.style.cursor = 'default';
        }
    } catch (error) {
        console.log(error);
    }

    // chatBox에서 chatList로 가는 버튼
    try {
        back.addEventListener('click', () => {
            chatList.classList.add('active');
            chatBox.classList.remove('active');
            socket.emit('leaveRoom', receiverUser, { id: data.id, nickname: data.nickname });
        });

        socket.on('leaveRoom', (room, user) => {
            console.log(user);
            console.log(`${user.nickname} left room ${room}`);
        })
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
async function GetAPI() {
    try {
        const { data } = await API.post('/post/detail', {
            headers: {
                "Content-Type": "application/json"
            },
            cookie: _cookie
        })
        title.value = data.posts.title;
        nickname.value = data.posts.User.nickname;
        contentArea.innerHTML = data.posts.content;
        let profileImg = data.posts.User.profile_img;
        if (!profileImg) {
            profileImg = "https://simplemarket2.s3.ap-northeast-2.amazonaws.com/defaultprofile.png"; // 디폴트 이미지 URL로 대체

        };
        document.getElementById('userImg').src = profileImg; // 이미지 추가

        if (data.posts.postLikes != null && data.posts.postLikes != 'null') {
            likeNum = data.posts.postLikes.split(',');
            postLikes.value = likeNum.length;
        } else {
            postLikes.value = 0;
        }

        posts = data.posts;
        users = data.users;

        // if(data.users.id != data.posts.userId){
        //     updateBtn.classList.add('unable');
        // }else{
        //     updateBtn.classList.remove('unable');
        // }

        // 좋아요 카운팅
        const likeCount = await API.post('/likecheck/post', {
            data: posts.id
        });

        postLikes.value = likeCount.data.length;

        await API.post('/reply', {
            headers: {
                "Content-Type": "application/json"
            },
            data: posts.id
        }).then((e) => {
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
            _li.append(_div1, _div2, _div3, _div4);
            reply_list.append(_li);

            if (e.data == null) {
                return;
            } else {
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let nowdate = year.toString();

                if (month >= 10) {
                    nowdate += month;
                } else {
                    nowdate += '0' + month;
                }

                if (day >= 10) {
                    nowdate += day;
                } else {
                    nowdate += '0' + day;
                }

                nowdate = Number(nowdate);

                e.data.forEach(async (el, index) => {
                    let updateDate = Number(el.updatedAt.slice(0, 10).split('-').join(''));

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
                    btn1.innerHTML = "답글";

                    if (nowdate > updateDate) {
                        _div8.innerHTML = el.updatedAt.slice(0, 10);
                    } else {
                        _div8.innerHTML = el.updatedAt.slice(11, 19);
                    }

                    _li1.append(_div5, _div6, _div7, _div8, btn1);

                    btn1.onclick = () => {
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

                        rediv.append(recontentdiv, rerebtn1, rerebtn2);

                        btn1.disabled = true; // 댓글 버튼 같은것 2번이상 안눌리게

                        rerebtn1.onclick = async () => {

                            btn1.disabled = false;
                            const form = new FormData();

                            form.append('content', recontentdiv.innerHTML);
                            form.append('userId', users.id);
                            form.append('replyId', el.id);

                            _li1.removeChild(rediv);
                            await API.post('/rereply/insert', form).then((e) => {
                                location.href = e.data;
                            }).catch((err) => {
                                console.log(err);
                            })
                        }

                        rerebtn2.onclick = () => {
                            _li1.removeChild(rediv);
                            btn1.disabled = false;
                        }

                        _li1.append(rediv);
                        recontentdiv.focus();
                    }

                    if (users.id == el.User.id) {
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
                                btn.style.margin = '5px';
                                btn4.style.display = 'none';
                                btn5.style.display = 'none';
                            });
                        };



                        btn2.onclick = () => {
                            alert('글을 수정하세요.')

                            btn4.style.display = 'inline-block';
                            btn5.style.display = 'inline-block';

                            _div6.contentEditable = true;

                            btn2.classList.add('unable');
                            btn3.classList.add('unable');
                            btn4.classList.remove('unable');
                            btn5.classList.remove('unable');


                        }

                        btn3.onclick = async () => {
                            try {
                                if (confirm('정말 삭제하시겠습니까?')) {
                                    await API.post('/reply/delete', {
                                        data: el.id
                                    }).then((e) => {
                                        location.href = e.data;
                                    }).catch((err) => {
                                        console.log(err);
                                    })
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }

                        btn4.onclick = async () => {
                            _div6.contentEditable = false;

                            btn2.classList.remove('unable');
                            btn3.classList.remove('unable');
                            btn4.classList.add('unable');
                            btn5.classList.add('unable');

                            const form = new FormData();

                            form.append('id', el.id);
                            form.append('content', _div6.innerHTML);

                            await API.post('/reply/update', form).then((e) => {
                                location.href = e.data;
                            }).catch((err) => {
                                console.log(err);
                            })
                        }

                        btn5.onclick = async () => {
                            _div6.contentEditable = false;
                            alert('수정이 취소되었습니다.');

                            _div6.innerHTML = el.content;

                            btn2.classList.remove('unable');
                            btn3.classList.remove('unable');
                            btn4.classList.add('unable');
                            btn5.classList.add('unable');
                        }

                        btn4.classList.add('unable');
                        btn5.classList.add('unable');


                        _li1.append(btn3, btn2, btn4, btn5, btnsDiv);
                    }
                    reply_list.append(_li1);

                    _li1.style.position = 'relative'; // _li1 요소에 position: relative; 추가


                    await API.post('/rereply', {
                        data: el.id
                    }).then((e) => {
                        if (e.data == null) {
                            return;
                        } else {
                            let date = new Date();
                            let year = date.getFullYear();
                            let month = date.getMonth() + 1;
                            let day = date.getDate();
                            let nowdate = year.toString();

                            if (month >= 10) {
                                nowdate += month;
                            } else {
                                nowdate += '0' + month;
                            }

                            if (day >= 10) {
                                nowdate += day;
                            } else {
                                nowdate += '0' + day;
                            }

                            nowdate = Number(nowdate);

                            e.data.forEach((el, index) => {

                                let updateDate = Number(el.updatedAt.slice(0, 10).split('-').join(''));

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
                                _rediv2.innerHTML = el.content;
                                _rediv3.innerHTML = el.User.nickname;
                                rebtn1.innerHTML = "답글";

                                if (nowdate > updateDate) {
                                    _rediv4.innerHTML = el.updatedAt.slice(0, 10);
                                } else {
                                    _rediv4.innerHTML = el.updatedAt.slice(11, 19);
                                }

                                _li2.append(_rediv1, _rediv2, _rediv3, _rediv4, rebtn1);

                                rebtn1.onclick = () => {
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

                                    rediv.append(recontentdiv, rerebtn1, rerebtn2);
                                    rebtn1.disabled = true;

                                    rerebtn1.onclick = async () => {
                                        rebtn1.disabled = false;
                                        const form = new FormData();

                                        form.append('content', recontentdiv.innerHTML);
                                        form.append('userId', users.id);
                                        form.append('replyId', el.replyId);

                                        _li2.removeChild(rediv);
                                        await API.post('/rereply/insert', form).then((e) => {
                                            location.href = e.data;
                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    }

                                    rerebtn2.onclick = () => {
                                        _li2.removeChild(rediv);
                                        rebtn1.disabled = false;
                                    }

                                    _li2.append(rediv);
                                    recontentdiv.focus();

                                }

                                if (users.id == el.User.id) {
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

                                    rebtnsDiv.append(rebtn2, rebtn3, rebtn4, rebtn5);

                                    rebtnsDiv.onclick = () => {
                                        const buttons = [rebtn2, rebtn3, rebtn4, rebtn5];
                                        buttons.forEach(rebtn => {
                                            btn.innerHTML = rebtn === rebtn2 ? '수정' :
                                                rebtn === rebtn3 ? '삭제' :
                                                    rebtn === rebtn4 ? '수정확인' :
                                                        '수정취소';

                                            rebtn.style.display = rebtn.style.display === 'none' ? 'inline-block' : 'none';
                                            rebtn.style.margin = '5px';
                                            rebtn4.style.display = 'none';
                                            rebtn5.style.display = 'none';
                                        });
                                    };


                                    rebtn2.innerHTML = '수정';
                                    rebtn3.innerHTML = '삭제';

                                    rebtn4.innerHTML = '수정확인';
                                    rebtn5.innerHTML = '수정취소';


                                    rebtn2.onclick = () => {
                                        alert('글을 수정하세요.');
                                        _rediv2.contentEditable = true;

                                        rebtn2.classList.add('unable');
                                        rebtn3.classList.add('unable');
                                        rebtn4.classList.remove('unable');
                                        rebtn5.classList.remove('unable');

                                        rebtn4.style.display = 'inline-block';
                                        rebtn5.style.display = 'inline-block';
                                    }

                                    rebtn3.onclick = async () => {
                                        try {
                                            if (confirm('정말 삭제하시겠습니까?')) {
                                                await API.post('/rereply/delete', {
                                                    data: el.id
                                                }).then((e) => {
                                                    location.href = e.data;
                                                }).catch((err) => {
                                                    console.log(err);
                                                })
                                            }
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }

                                    rebtn4.onclick = async () => {
                                        _rediv2.contentEditable = false;

                                        rebtn2.classList.remove('unable');
                                        rebtn3.classList.remove('unable');
                                        rebtn4.classList.add('unable');
                                        rebtn5.classList.add('unable');

                                        const form = new FormData();

                                        form.append('id', el.id);
                                        form.append('content', _rediv2.innerHTML);

                                        await API.post('/rereply/update', form).then((e) => {
                                            location.href = e.data;
                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    }

                                    rebtn5.onclick = () => {
                                        alert('수정이 취소되었습니다.')
                                        _rediv2.contentEditable = false;

                                        _rediv2.innerHTML = el.content;

                                        rebtn2.classList.remove('unable');
                                        rebtn3.classList.remove('unable');
                                        rebtn4.classList.add('unable');
                                        rebtn5.classList.add('unable');
                                    }

                                    rebtn4.classList.add('unable');
                                    rebtn5.classList.add('unable');


                                    _li2.append(rebtn3, rebtn2, rebtn4, rebtn5, rebtnsDiv);

                                }

                                _li1.append(_li2);

                                _li2.style.position = 'relative'



                            });
                            // 자기 아이디 아니면 버튼 안보이게

                            console.log("아이디 식별?", data);
                            // 수정 버튼
                            if (!(data.users.id == data.posts.userId)) {
                                document.getElementById('toUpdate').style.display = "none";
                            };
                            // 삭제 버튼
                            if (!(data.users.id == data.posts.userId)) {
                                document.getElementById('toDelete').style.display = 'none';
                            }
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                });
            }
        }).catch((err) => {
            console.log(err);
        })


    } catch (error) {
        console.log(error);
    }
}

GetAPI();

toUpdate.onclick = async () => {
    try {
        await API.post('/post/updateviewIn', {
            headers: {
                "Content-Type": "application/json"
            },
            data: posts.id,
            cookie: _cookie
        }).then((e) => {
            location.href = e.data;
        }).catch((err) => {
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
}

toDelete.onclick = async () => {
    try {
        if (confirm('정말 삭제하시겠습니까?')) {
            await API.post('/post/delete', {
                headers: {
                    "Content-Type": "application/json"
                },
                data: posts.id,
                cookie: _cookie
            }).then((e) => {
                location.href = e.data;
            }).catch((err) => {
                console.log(err);
            })
        }
    } catch (error) {
        console.log(error);
    }
}

let likeBtn = document.getElementById('likeBtn')



// 좋아요 버튼 이미지
likeBtn.onload = async() => {
    try {
        const form = new FormData();

        form.append('postId', posts.id);
        form.append('userId', users.id);

        await API.post('/likecheck/post/btnImg', form).then((e) => {
            console.log(e.data)
            if(e.data != null){
                likeBtn.src = 'https://simplemarket2.s3.ap-northeast-2.amazonaws.com/redHeart.png';
            }else{
                likeBtn.src="https://simplemarket2.s3.ap-northeast-2.amazonaws.com/Like_Heart.png"
            }
        }).catch((err)=>{
            console.log(err);
        })        
    } catch (error) {
        console.log(error);
    }
}

// 좋아요 버튼 기능
likeBtn.onclick = async function () {
    try {
        const form = new FormData();

        form.append('postId', posts.id);
        form.append('userId', users.id);

        await API.post('/likecheck/post/add', form).then((e) => {
            location.href = e.data;
        }).catch((err) => {
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
}

// 댓글 달기
reply_on.onclick = async () => {
    try {
        const form = new FormData();

        form.append('content', write_reply.innerHTML);
        form.append('userId', users.id);
        form.append('postId', posts.id);

        await API.post('/reply/insert', form).then((e) => {
            location.href = e.data;
        }).catch((err) => {
            console.log(err);
        });

    } catch (error) {
        console.log(error);
    }
}


// 전체 글 목록 페이지로 이동 = 메인 페이지
const usedMarket = document.querySelector('.used-market');

usedMarket.onclick = () => {
    location.href = `./${mainUrl}`;
}

// 동네 장터 이동
const localMarket = document.querySelector('.local-market');

localMarket.onclick = () => {
    location.href = `./local${urlEnd}`;
}

// 통계 페이지 이동
const postStat = document.querySelector('.post-stat');

postStat.onclick = () => {
    location.href = `./statistic${urlEnd}`;
}