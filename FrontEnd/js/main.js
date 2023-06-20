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
            window.location.href = "./main.html"
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
// -----------------------------------------실시간 채팅------------------------------------------------------

const chatBox = document.querySelector('.chatBox');
const chatList = document.querySelector('.chatList');
const userChatList = document.querySelector('.user_chat_list');
const chatBoxClose = document.querySelectorAll('.close_chatBox');
const chatContent = document.querySelector('.chat_content');
const back = document.querySelector('.back');
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;


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

// 유저와의 채팅 목록을 나타내는 이벤트(관리자만 볼 수 있음)
async function selectUserChat() {
    try {
        console.log(userChatList);
        const chatMessages = document.querySelectorAll(`.chat_message`);
        chatMessages.forEach((e) => {
            e.addEventListener('dblclick', () => {
                const userNickname = e.getAttribute('data_nickname');
                openChatBox(userNickname);
                console.log(userNickname);
                return userNickname;
            })
        })
    } catch (error) {
        console.error(error);
    }
}

function openChatBox(userNickname) {
    chatBox.classList.add('active');
    chatList.classList.remove('active');
}

window.onload = async () => {
    const { data } = await axios.get('http://127.0.0.1:8080/login/view', {
        withCredentials: true
    });

    const nickname = data.nickname;
    const profileImg = data.profile_img;
    const room = data.id;


    const socket = io.connect();
    socket.emit('joinRoom', room, nickname);


    // 채팅방에 표시되는 메시지 형태
    socket.on('message', (data) => {
        console.log(data);
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
                    <p class="nickname">${nickname}</p>
                    <p class="message ballon">${data.message}</p>
                    <p class="date">${timeString}</p>
                </div>
            </div>
            `;
        }
        chatContent.innerHTML += el;
    })

    btn.onclick = async () => {
        const messageData = {
            message: msg.value,
            chatId: data.id
        }
        socket.emit('message', room, messageData);
        msg.value = '';
        await axios.post('http://127.0.0.1:8080/chat/chat_insert', messageData, {
            withCredentials: true
        })
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
        if (data == '가입 안한 아이디 입니다.' || data == '비번 틀림' || data == `승인이 거절되었습니다.\n회원가입을 다시 진행해주세요.` || data == '가입 승인 대기중입니다.' || data == '관리자 계정이 생성되었습니다.') {
            alert(data);
        } else {
            window.location.href = "./mypage.html";
        }
    } catch (error) {
        console.log(error);
    }
}

loginBtn.onclick = function () {
    Login(user_id.value, user_pw.value);
}