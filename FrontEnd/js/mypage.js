// cookie 값 설정
let _cookie = document.cookie;
_cookie = _cookie.replace("login=","");

// 관리자 게시판 기능 (유저만 안보이게)
async function checkAdmin() {
    const adminHide = document.getElementById('admin-hide');
    const {data} = await API.post("/login/view", {
        cookie : _cookie
    });
    if(data && data.grade == "3"){
        adminHide.style.display = "";
    }else{
        adminHide.style.display = "none"
    }
}
// 쿠키 생성
const setCookie = (cname, cvalue, cexpire) => {

    // 만료일 생성 -> 현재에서 30일간으로 생성 -> setDate() 메서드 사용
    let expiration = new Date();
    expiration.setDate(expiration.getDate() + parseInt(cexpire)); // Number()로 처리 가능

    // 쿠키 생성하기
    let cookie = '';
    cookie = `${cname}=${cvalue}; expires=${expiration.toUTCString()};`;
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
            cookie : _cookie
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
        cookie : _cookie
    })
    if (!data.name) {
        Logout.style.display = "none";
    }
}

// 로고 클릭 시 main으로 돌아가기
const logo = document.querySelector('.logo');
logo.onclick = () => {
    location.href = `./${mainUrl}`
}

// 어드민 버튼 기능
const admin_hide = document.getElementById('admin-hide');
admin_hide.onclick = () => {
    location.href = `./signUpList${urlEnd}`;
}

// 사진 수정 기능
document.getElementById('uploadBtn').addEventListener('click', async () => {
    // 파일 삽입하지 않으면
    if (!file.files[0]) {
        alert('사진을 삽입해주세요');
        return;
    }
    try {
        const form = new FormData();
        // console.log('사진이름',imgs.value)
        // console.log('파일 내용',file.files[0])
        form.append("imgs", imgs.value);
        form.append("upload", file.files[0]);
        form.append("userId", "user_id");
        form.append('cookie',_cookie);
        await API.post('/upload', form, {
            headers: { "content-Type": "multipart/form-data" },
            withCredentials: true
        });

        window.location.href = `./mypage${urlEnd}`;


    } catch (error) {
        console.log(error);
    }
})

// 닉네임 변경 이벤트 리스너
document.getElementById("nickname-update-button").addEventListener("click", async () => {
    const newNickname = prompt("새로운 별명을 입력해주세요.");
    if (newNickname) {
        try {
            const response = await API.post("/mypage", {
                nickname: newNickname,
                cookie : _cookie
            }, {
                withCredentials: true
            });
            document.getElementById("nickname").innerText = newNickname;
        } catch (error) {
            console.log(error);
        }
    }
});

    async function getAPI() {
        try {
            const {data} = await API.post("/login/view",{
                cookie : _cookie
            });
            // console.log(data);
            user_name.innerHTML = data.name;
            user_age.innerHTML = data.age;
            nickname.innerHTML = data.nickname;
            // gender.innerHTML = data.gender;
            address.innerHTML = data.address;

        if (data.gender === "male") {
            document.getElementById('gender').innerText = "남자";
        } else if (data.gender === "female") {
            document.getElementById('gender').innerText = "여자";
        } else {
            document.getElementById('gender').innerText = "undefined"
        }

        // 프로필 이미지 수정 
        if (data.profile_img) {
            document.querySelector("img").src = data.profile_img;
        }

    } catch (error) {
        console.log(error)
    }
}

// right-side 에 보여지는 내가 쓴 글 타이틀

async function getUserPost() {
    try {
        const { data: posts } = await API.post("/post",{
            cookie : _cookie
        });
        const { data: userInfo } = await API.post("/login/view",{
            cookie : _cookie
        });

        const myPostList = document.getElementById('my-post-list');

        await posts.forEach(post => {
            const listItem = document.createElement('li');

        if (userInfo.id === post.userId) {
            listItem.textContent = `글 제목 : ${post.title} 작성자 : ${post.User.nickname} 작성시간 : ${post.createdAt}`;
            myPostList.appendChild(listItem);
        }
        listItem.style.cursor = "pointer";
        listItem.addEventListener('click', async () => {
            const { data } = await API.post(`/mypage/detailIn`,{
                data : post.id,
                cookie : _cookie
            },{withCredentials : true,})
            window.location.href = data;
        })
    });
    } catch (error) {
        console.log(error);
    }
};

getAPI();
checkAdmin();
getUserPost();

// 헤더에 중고장터 a 태그
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

// -----------------------------------------실시간 채팅------------------------------------------------------

const chatBox = document.querySelector('.chatBox');
const chatList = document.querySelector('.chatList');
const userChatList = document.querySelector('.user_chat_list');
const chatBoxClose = document.querySelectorAll('.close_chatBox');
const chatContent = document.querySelector('.chat_content');
const back = document.querySelector('.back');
const chatImg = document.querySelector('.chatImg');



// 채팅 목록과 채팅 팝업창 함수
async function popup() {
    try {
        const { data } = await API.post("/login/view", {
            cookie : _cookie
        });

        document.body.classList.toggle('active');
        if (data.grade === '3') {
            chatList.classList.add('active');
        } else {
            chatBox.classList.add('active');
        }

        chatImg.style.display = 'none';
    } catch (error) {
        console.error(error);
    }
}

// 채팅 목록과 채팅 팝업창 close 이벤트
chatBoxClose.forEach(btn => {
    btn.addEventListener('click', () => {
        chatBox.classList.remove('active');
        chatList.classList.remove('active');
        chatImg.style.display = 'block';
    });
});

async function ChattingOnload () {
    const { data } = await API.post('/login/view', {
        cookie: _cookie
    });

    const socket = io.connect(serverUrl);
    const nickname = data.nickname;

    if (data.grade === '2') {
        chatImg.addEventListener('click', () => {
            socket.emit('joinRoom', nickname, { id: data.id, nickname: data.nickname });
            // if (sessionStorage.getItem(`${data.nickname}_joined`) === null) {
            //     sessionStorage.setItem(`${data.nickname}_joined`, 'false');
            // }
            ChattingOnload();
        })
    }

    const users = await API.post('/login/viewAll', {
        cookie: _cookie
    });
    const userData = users.data;
    // console.log(userData);
    const admin = userData[0];
    // console.log(admin);

    localStorage.setItem('joined', 'false');

    socket.on('joinRoom', (room, user, userList) => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

        if (localStorage.getItem('joined') === 'false') {
            if (user.id !== admin.id) {
                if(chatContent.innerHTML == ''){
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
        }
        localStorage.setItem('joined', 'true');
    })

    // 유저들의 채팅 목록을 나타내는 이벤트(관리자만 보임)
    try {
        const response = await API.get('/chat/all_chats', {
            withCredentials: true
        });
        const chats = response.data;
        // console.log(chats);

        chats.forEach(chat => {
            // console.log(chat);
            let chatUser = chat.User;
            // console.log(chatUser);

            if (chatUser.grade === '3') {
                return;
            }

            let createdAt = new Date(chatUser.createdAt);
            let hours = createdAt.getHours();
            let minutes = createdAt.getMinutes();

            const userInList = userChatList.querySelector(`.chat_message[data_nickname="${chatUser.nickname}"]`);
            // console.log(userInList);
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
            // console.log(`${nickname}방 입장`);
            receiverUser = userData.filter((i) => {
                return i.nickname == nickname;
            });

            // console.log(receiverUser);



            if (data.grade === '3') {
                // room = nickname;
                socket.emit('joinRoom', nickname, { id: data.id, nickname: data.nickname });

                await API.post('/chat/chatStory', {
                    user: receiverUser,
                    cookie: _cookie
                }).then((e)=>{
                    const chat = e.data;

                    const now = new Date(chat.createdAt);
                    const hours = now.getHours();
                    const minutes = now.getMinutes();
                    const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

                    let profileImg;
                    if (chat.User.profile_img == null) {
                        profileImg = "https://simplemarket2.s3.ap-northeast-2.amazonaws.com/defaultprofile.png"; // 디폴트 이미지 URL로 대체
                    } else {
                        profileImg = chat.User.profile_img;
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

                    chatContent.innerHTML = beforMessage;
                }).catch((err)=>{
                    console.log(err);
                })
                
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
        // console.log(data);
        // console.log(nickname)

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
            back.style.backgroundImage = "url(https://simplemarket2.s3.ap-northeast-2.amazonaws.com/back-removebg-preview.png)";
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
            // console.log(user);
            // console.log(`${user.nickname} left room ${room}`);
        })
    } catch (error) {
        console.log(error);
    }

}

ChattingOnload();