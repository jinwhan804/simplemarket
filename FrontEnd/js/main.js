// 마이페이지 버튼 로그인 됐을때만 보이게
const mypageBtn = document.getElementById('mypage-btn');

async function mypageHide() {
    const { data } = await axios.get('http://127.0.0.1:8080/login/view', {
        withCredentials: true
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
    const { data } = await axios.get('http://127.0.0.1:8080/login/view', {
        withCredentials: true
    })
    if (data.name) {
        popupLoginBtn.style.display = "none";
    }
}

// 로그아웃 기능
const Logout = document.getElementById('logout');

Logout.addEventListener('click', async () => {
    try {
        const { data } = await axios.get("http://127.0.0.1:8080/logout", {
            withCredentials: true,
        });
        if (data == "메인 페이지") {
            window.location.href = `./${mainUrl}`;
            alert("로그아웃 되었습니다.")
        }
    } catch (error) {
        console.log(error);
    }
})
// 로그아웃 버튼 로그인 안되어 있을 때는 안보이게
async function logoutBtnHide() {
    const { data } = await axios.get('http://127.0.0.1:8080/login/view', {
        withCredentials: true
    })
    if (!data.name) {
        Logout.style.display = "none";
    }
}


async function getAPI() {
    try {
        const { data } = await axios.get("http://127.0.0.1:8080/login/view", {
            withCredentials: true,
        });

        if (data.name) {
            loginPopup.style.display = "none";
        } else {
            loginPopup.style.display = "flex";
        }

    } catch (error) {
        console.log(error)
    }
}
getAPI();
mypageHide();
loginBtnHide();
logoutBtnHide();

// 로고 클릭 시 main으로 돌아가기
const logo = document.querySelector('.logo');
logo.onclick = ()=>{
    location.href = `./${mainUrl}`
}

// 마이 페이지 버튼 기능
const mypage_btn = document.getElementById('mypage-btn');
mypage_btn.onclick = ()=>{
    location.href = `./mypage${urlEnd}`;
}

// -----------------------------------------실시간 채팅------------------------------------------------------

const chatBox = document.querySelector('.chatBox');
const chatList = document.querySelector('.chatList');
const chatBoxClose = document.querySelectorAll('.close_chatBox');
const chatContent = document.querySelector('.chat_content');
const back = document.querySelector('.back');
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;


// 채팅 목록과 채팅 팝업창 함수
async function popup() {
    const { data } = await axios.get("http://127.0.0.1:8080/login/view", {
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
        const response = await axios.get('http://127.0.0.1:8080/login/viewAll', {
            withCredentials: true
        });
        const users = response.data;
        const chatMessages = document.querySelectorAll(`.chat_message`);
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
    chatList.classList.remove('active');
}


// 채팅 소켓
async function userInfo() {
    const response = await axios.get('http://127.0.0.1:8080/login/view', {
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
        const getChatData = await axios.get('http://127.0.0.1:8080/chat/all_chats', {
            withCredentials: true
        });
        console.log(getChatData);
        const chatData = getChatData.data;
        const userChatList = document.querySelector('.user_chat_list');
        const socket = io.connect(serverUrl);

        chatData.forEach(data => {
            const now = new Date(data.createdAt);
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const time = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
            // console.log(data);
            let el;
            if (data.nickname === nickname) {
                el = `
                <div class="content my-message">
                    <p class="message ballon">${data.message}</p>
                    <p class="date">${time}</p>
                </div>
                `;
            } else {
                el = `
                <div class="content other-message">
                    <img src="${data.profile_img}">
                    <div class="message-display">
                        <p class="nickname">${data.nickname}</p>
                        <p class="message ballon">${data.message}</p>
                        <p class="date">${time}</p>
                    </div>
                </div>
                `;
            }
            chatContent.innerHTML += el;
        });

        // 관리자만 보이게 하는 뒤로가기 버튼
        try {
            const { data } = await axios.get("http://127.0.0.1:8080/login/view", {
                withCredentials: true
            });
            console.log(data);
            if (data.grade === '3') {
                back.style.display = 'block';
                console.log('1');
            } else {
                back.style.display = 'none';
                console.log('2');
            }
        } catch (error) {
            console.log(error);
        }

        // chatBox에서 chatList로 가는 버튼
        back.addEventListener('click', () => {
            chatList.classList.add('active');
            chatBox.classList.remove('active');
        });

        // 채팅방 채팅 코드
        socket.on('message', (data) => {
            const now = new Date(data.createdAt);
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const time = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
            console.log(data);
            let el;
            if (data.nickname === nickname) {
                el = `
                <div class="content my-message">
                    <p class="message ballon">${data.message}</p>
                    <p class="date">${time}</p>
                </div>
                `;
            } else {
                el = `
                <div class="content other-message">
                    <img src="${data.profile_img}">
                    <div class="message-display">
                        <p class="nickname">${data.nickname}</p>
                        <p class="message ballon">${data.message}</p>
                        <p class="date">${time}</p>
                    </div>
                </div>
                `;
            }
            chatContent.innerHTML += el;
        })

        // 채팅 목록 코드
        chatData.forEach(data => {
            const userInList = userChatList.querySelector(`.chat_message[data_nickname="${data.nickname}"]`);
            // console.log(data);
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

        // 메시지 보내는 코드
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
            axios.post('http://127.0.0.1:8080/chat/chat_insert', messageData, {
                withCredentials: true
            })
        }
    } catch (error) {
        console.log(error);
    }
}

// 로그인 기능
const LoginForm = document.getElementById('loginForm');
async function Login(user_id, user_pw) {
    try {
        const { data } = await axios.post('http://127.0.0.1:8080/login', { user_id, user_pw }, {
            withCredentials: true
        });
        console.log(data);
        if (data.msg == '가입 안한 아이디 입니다.' || data.msg == '비번 틀림' || data.msg == `승인이 거절되었습니다.\n회원가입을 다시 진행해주세요.` || data.msg == '가입 승인 대기중입니다.') {
            alert(data.msg);
        } else {
            document.cookie = `connect.sid=${data.token}; path=/`;
            window.location.href = `./mypage${urlEnd}`;
        }
    } catch (error) {
        console.log(error);
    }
}

loginBtn.onclick = function () {
    Login(user_id.value, user_pw.value);
}