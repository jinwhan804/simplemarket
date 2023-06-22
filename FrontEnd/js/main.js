// 로그인 유저 확인용 변수
let users;

// 마이페이지 버튼 로그인 됐을때만 보이게
const mypageBtn = document.getElementById('mypage-btn');

async function mypageHide() {
    const { data } = await API.get('/login/view', {
        withCredentials: true
    })
    if (!data.name) {
        mypageBtn.style.display = "none";
    }
}

// 로그인 팝업
const loginPopup = document.querySelector('.loginPopup');
const popupLoginBtn = document.getElementById('popup-login');

const postArea = document.getElementById('text-container');
popupLoginBtn.addEventListener('click', () => {
    if (loginPopup.style.display === "none") {
        loginPopup.style.display = "flex";
    } else {
        loginPopup.style.display = "none";
    }

})

// 로그인 버튼 로그인 되어 있을 떄는 안보이게
const loginBtn = document.getElementById('loginBtn');

async function loginBtnHide() {
    const { data } = await API.get('/login/view', {
        withCredentials: true
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
        withCredentials: true
    })
    if (!data.name) {
        Logout.style.display = "none";
    }
}


async function getAPI_popup() {
    try {
        const { data } = await API.get("/login/view", {
            withCredentials: true,
        });

        if (data.name) {
            users = data;
            loginPopup.style.display = "none";
            postArea.style.display = 'block';
        } else {
            loginPopup.style.display = "flex";
            postArea.style.display = 'none';
        }

    } catch (error) {
        console.log(error)
    }
}
getAPI_popup();
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
        const { data } = await axios.get("http://127.0.0.1:8080/login/view", {
            withCredentials: true
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
    const { data } = await axios.get('http://127.0.0.1:8080/login/view', {
        withCredentials: true
    });

    const socket = io.connect(serverUrl);
    const nickname = data.nickname;
    let room = data.id;

    if (data.grade === '2') {
        const chatImg = document.querySelector('.chatImg');
        chatImg.addEventListener('click', () => {
            socket.emit('joinRoom', nickname, { id: data.id, nickname: data.nickname });
        })
    }

    const users = await axios.get('http://127.0.0.1:8080/login/viewAll', {
        withCredentials: true
    });
    const userData = users.data;
    const admin = userData[0];
    console.log(admin);

    socket.on('joinRoom', (room, user, userList) => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

        if (user.id !== admin.id) {
            const welcomeMessage = `
            <div class="content other-message">
                <img src="${admin.profile_img}">
                <div class="message-display">
                    <p class="nickname">${admin.nickname}</p>
                    <p class="message ballon">환영합니다!</p>
                    <p class="date">${timeString}</p>
                </div>
            </div>
            `
            chatContent.innerHTML += welcomeMessage;
        }
    })


    // 유저들의 채팅 목록을 나타내는 이벤트(관리자만 보임)
    try {
        const response = await axios.get('http://127.0.0.1:8080/chat/all_chats', {
            withCredentials: true
        });
        const chats = response.data;
        console.log(chats);

        chats.forEach(chat => {
            chatUser = chat.User;

            if (chatUser.grade === '3') {
                return;
            }

            let createdAt = new Date(chatUser.createdAt);
            let hours = createdAt.getHours();
            let minutes = createdAt.getMinutes();

            const userInList = userChatList.querySelector(`.chat_message[data_nickname="${chatUser.nickname}"]`);

            if (userInList) {
                // 채팅 목록에서 해당 유저가 있으면 목록에 추가하지 않고 메시지만 업데이트
                userInList.querySelector('.message_content').textContent = chatUser.message;
            } else {
                // 리스트에 없으면 추가
                let newMessageHTML = `
                <div class="chat_message" data_nickname="${chatUser.nickname}">
                    <img src="${chatUser.profile_img}">
                    <p>${chatUser.nickname}: <span class="message_content">${chatUser.message}</span></p>
                    <p>${hours}:${minutes < 10 ? '0' + minutes : minutes}</p>
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
        item.addEventListener('dblclick', () => {
            const nickname = item.getAttribute('data_nickname');
            chatBox.classList.add('active');
            chatList.classList.remove('active');
            console.log(`${nickname}방 입장`);
            receiverUser = nickname;

            if (data.grade === '3') {
                // room = nickname;
                socket.emit('joinRoom', nickname, { id: data.id, nickname: data.nickname });
            }

        });
    });


    btn.onclick = async () => {
        try {
            const messageData = {
                nickname: data.nickname,
                message: msg.value,
                sender: data.id,
                profile_img: data.profile_img,
                receiver: data.grade === '2' ? admin.nickname : receiverUser
            }
            if (data.grade === '3') {
                socket.emit('chat', receiverUser, messageData);
            } else
                socket.emit('chat', nickname, messageData);
            msg.value = '';
            await axios.post('http://127.0.0.1:8080/chat/chat_insert', messageData, {
                withCredentials: true
            })
        } catch (error) {
            console.log(error);
        }
    }

    socket.on('chat', (data) => {
        console.log(data);

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

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
                <img src="${data.profile_img}">
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
            back.style.display = 'block';
        } else {
            back.style.display = 'none';
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
            console.log(`${user.nickname} left room ${room}`);
        })
    } catch (error) {
        console.log(error);
    }

}






// 로그인 기능
const LoginForm = document.getElementById('loginForm');
async function Login(user_id, user_pw) {
    try {
        const { data } = await API.post('/login', { user_id, user_pw }, {
            withCredentials: true
        });
        console.log(data);
        if (data == '가입 안한 아이디 입니다.' || data == '비번 틀림') {
            alert(data);
        } else if (data.msg == `승인이 거절되었습니다.\n회원가입을 다시 진행해주세요.` || data.msg == '가입 승인 대기중입니다.') {
            alert(data.msg);
        } else {
            setCookie('login', data.token, 30);
            window.location.href = `./${mainUrl}`;
        }
    } catch (error) {
        console.log(error);
    }
}

loginBtn.onclick = function () {
    Login(user_id.value, user_pw.value);
}

// 회원가입 클릭, 로고 클릭, 마이페이지 버튼 클릭

// const toInsert = document.getElementById('toInsert');
const toSignUp = document.getElementById('toSignUp')

// toInsert.addEventListener ('click', () => {
//     location.href = `./insert${urlEnd}`;
// })

toSignUp.addEventListener('click', () => {
    location.href = `./signUp${urlEnd}`;
})

const Logo = document.querySelector('.logo').addEventListener('click', () => {
    location.href = `./${mainUrl}`;
})

mypageBtn.addEventListener('click', () => {
    location.href = `./mypage${urlEnd}`;
})

////////////////////////////// 메인 게시판 영역 ////////////////////////////////////

let posts;

async function GetAPI(currentPage) {
    try {
        post_list.innerHTML = "";
        let _tr1 = document.createElement('tr');
        let _th1 = document.createElement('th');
        let _th2 = document.createElement('th');
        let _th3 = document.createElement('th');
        let _th4 = document.createElement('th');
        let _th5 = document.createElement('th');
        let _th6 = document.createElement('th');
        _th1.innerHTML = "No.";
        _th2.innerHTML = '제목';
        _th3.innerHTML = '작성자';
        _th4.innerHTML = '작성일';
        _th5.innerHTML = '수정일';
        _th6.innerHTML = '조회수';
        _tr1.append(_th1, _th2, _th3, _th4, _th5, _th6);
        post_list.append(_tr1);

        btns.innerHTML = '';

        const { data } = await API.get('/post');

        posts = data;
        console.log(posts);

        let pageOffset = 10;
        let pageGroup = currentPage * pageOffset;
        let pageNum = 0;

        if (data == null) {
            return;
        } else {
            data.forEach((el, index) => {
                if (index % pageOffset == 0) {
                    let btn = document.createElement('button');
                    btn.innerHTML = index / 10 + 1;
                    btn.className = 'pageBtn';
                    btn.onclick = () => {
                        pageNum = index;
                        GetAPI(index / pageOffset);
                    }
                    btns.append(btn);
                }
            })

            const _data = data.slice(pageGroup, pageGroup + pageOffset);

            _data.forEach((el,index) => {
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

                let createDate = Number(el.createdAt.slice(0, 10).split('-').join(''));
                let updateDate = Number(el.updatedAt.slice(0, 10).split('-').join(''));

                let _tr = document.createElement('tr');
                let _td1 = document.createElement('td');
                let _td2 = document.createElement('td');
                let _td3 = document.createElement('td');
                let _td4 = document.createElement('td');
                let _td5 = document.createElement('td');
                _tr.className = 'postTr';
                _td1.innerHTML = index + 1;
                _td2.innerHTML = el.title;
                _td3.innerHTML = el.User.nickname;

                if (nowdate > createDate) {
                    _td4.innerHTML = el.createdAt.slice(0, 10);
                } else {
                    _td4.innerHTML = el.createdAt.slice(11, 19);
                }

                if (nowdate > updateDate) {
                    _td5.innerHTML = el.updatedAt.slice(0, 10);
                } else {
                    _td5.innerHTML = el.updatedAt.slice(11, 19);
                }

                _tr.onclick = async () => {         
                    const form = new FormData();

                    form.append('postId',el.id);
                    form.append('userId',users.id);
                    // 조회수 추가
                    await API.post('/viewcheck/add',form);

                    await API.post('/post/detail', {
                        data: el.id
                    }).then((e) => {
                        location.href = e.data;
                    }).catch((err) => {
                        console.log(err);
                    })
                }

                _tr.append(_td1, _td2, _td3, _td4, _td5);
                post_list.append(_tr);
            });

            // 조회수 계산
            CalculateViews();
        }
    } catch (error) {
        console.log(error);
    }
}

GetAPI(0);

// 조회수 계산 함수
function CalculateViews (){
    const postTrs = document.querySelectorAll('.postTr');
    posts.forEach(async(el,index)=>{
        await API.post('/viewcheck',{
            data : el.id
        }).then((e)=>{
            const viewTd = document.createElement('td');
            viewTd.innerHTML = e.data.length;

            postTrs[index].append(viewTd);
        })
    })
}

// 전체 글 목록 페이지로 이동 = 메인 페이지
const usedMarket = document.querySelector('.used-market');

usedMarket.onclick = () => {
    location.href = `./${mainUrl}`;
}

const toInsert = document.getElementById('inInsert');

toInsert.onclick = () => {
    location.href = `./insert${urlEnd}`;
}

// 동네 장터 이동
const localMarket = document.querySelector('.local-market');

localMarket.onclick = () => {
    location.href = `./local${urlEnd}`;
}

// 통계 페이지 이동
const postStat = document.querySelector('.post-stat');

postStat.onclick = ()=>{
    location.href = `./statistic${urlEnd}`;
}