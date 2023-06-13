// 관리자 게시판 기능 (유저만 안보이게)
async function checkAdmin() {
    const adminHide = document.getElementById('admin-hide');
    const { data } = await axios.get("http://127.0.0.1:8080/login/view", {
        withCredentials: true
    });
    if (data.grade != "3") {
        adminHide.style.display = "none";
    }
}
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
        console.log(data);
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
checkAdmin();


// -----------------------------------------실시간 채팅------------------------------------------------------

const chatBox = document.querySelector('.chatBox');
const chatList = document.querySelector('.chatList');
const chatBoxClose = document.querySelector('.close_chatBox');
const chatContent = document.querySelector('.chat_content');
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

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

chatBoxClose.addEventListener('click', () => {
    document.body.classList.remove('active');
    chatBox.classList.remove('active');
    chatList.classList.remove('active');
})

const userChatList = document.querySelector('.user_chat_list');
const chatMessage = document.querySelector('.chat_message');
// const userInList = userChatList.querySelector(`.chat_message[data_nickname="${data.nickname}"]`);

// function selectList(activeTab) {
//     const {data} = axios.get('http://127.0.0.1:8080/login/view', {
//         withCredentials: true
//     });

//     if (activeTab == data.nickname) {
//         chatMessage.style.backgroundColor = 'rgb(241, 236, 236)';
//     } else {
//         chatMessage.style.backgroundColor = '';
//     }
// }



async function handleClickEvent() {
    let response;
    try {
        response = await axios.get('http://127.0.0.1:8080/login/view', {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
    }

    let data = response.data;
    console.log(data);

    userChatList.addEventListener('click', (event) => {
        // .chat_message 요소에서 클릭 이벤트가 발생했는지 확인
        if (!event.target.closest('.chat_message')) return;

        // 클릭한 .chat_message 요소 가져오기
        let clickedChatMessage = event.target.closest('.chat_message');

        // 모든 .chat_message 요소에서 스타일 제거
        let chatMessages = userChatList.querySelectorAll('.chat_message');
        chatMessages.forEach((chatMessage) => {
            chatMessage.style.backgroundColor = '';
        });

        // 클릭한 .chat_message에만 스타일 적용
        if (clickedChatMessage.dataset.nickname === data.nickname) {
            clickedChatMessage.style.backgroundColor = 'rgb(241, 236, 236)';
        }
    });
}

handleClickEvent();




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
