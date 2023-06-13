// 관리자 게시판 기능 (유저만 안보이게)
// async function checkAdmin() {
//     const adminHide = document.getElementById('admin-hide');
//     const { data } = await axios.get("http://127.0.0.1:8080/login/view", {
//         withCredentials: true
//     });
//     if (data.grade != "3") {
//         adminHide.style.display = "none";
//     }
// }
// 로그아웃 기능
const Logout = document.getElementById('logout');

Logout.addEventListener('click', async () => {
    try {
        const { data } = await axios.get("http://127.0.0.1:8080/logout", {
            withCredentials: true,
        });
        if (data == "로그인 페이지") {
            window.location.href = "/frontEnd/login.html";
        }
    } catch (error) {
        console.log(error);
    }
})

async function getAPI() {
    try {
        const { data } = await axios.get("http://127.0.0.1:8080/login/view", {
            withCredentials: true,
        });
        // console.log(data);
        user_name.innerHTML = data.name;
        user_age.innerHTML = data.age;
        nickname.innerHTML = data.nickname;
        // gender.innerHTML = data.gender;
        address.innerHTML = data.address;

        if (data.gender === "male") {
            document.getElementById('gender').innerText = '남자';
        } else if (data.gender === "female") {
            document.getElementById('gender').innerText = '여자';
        } else {
            document.getElementById('gender').innerText = "undefined"
        }

        if (data.profile_img) {
            document.querySelector("img").src = "" + data.profile_img;
        }

    } catch (error) {
        console.log(error)
    }
}
getAPI();
// checkAdmin();


// -----------------------------------------실시간 채팅------------------------------------------------------

const chatBox = document.querySelector('.chatBox');
const chatBoxClose = document.querySelector('.close_chatBox');
const chatContent = document.querySelector('.chat_content');
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
const loginPopup = document.querySelector('.loginPopup');

function popup() {
    document.body.classList.toggle('active');
    chatBox.classList.add('active');
}

chatBoxClose.addEventListener('click', () => {
    document.body.classList.remove('active');
    chatBox.classList.remove('active');
})

// function loginPopup() {
    
// }

// message.addEventListener('input', (e) => {
//     const message = e.target.value;
//     console.log(message);
//     chatContent.textContent = message;
// })

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
        const getChatData = await axios.get('http://localhost:8080/chat/all_chats', {
            withCredentials: true
        });
        console.log(getChatData);
        const chatData = getChatData.data;
        const userChatList = document.querySelector('.user_chat_list');



        // userChatList.innerHTML = chatDataHTML;

        const socket = io.connect("http://localhost:8080");
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
        if (data == '가입 안한 아이디 입니다.' || data == '비번 틀림' || data == `승인이 거절되었습니다.\n회원가입을 다시 진행해주세요.` || data == '가입 승인 대기중입니다.') {
            alert(data);
        } else {
            window.location.href = "http://127.0.0.1:5500/FrontEnd/mypage.html";
            // LoginForm.style.display = "none";
        }
    } catch (error) {
        console.log(error);
    }
}

loginBtn.onclick = function () {
    Login(user_id.value, user_pw.value);
}