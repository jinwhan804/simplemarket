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


async function getAPI_popup() {
    try {
        const { data } = await API.get("/login/view", {
            withCredentials: true,
        });

        if (data.name) {
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
    try {
        const { data } = await API.get('/login/view', {
            withCredentials: true
        });

        console.log(data);
        return {
            nickname: data.nickname,
            profileImg: data.profile_img,
            userId: data.user_id,
            user_info: data.id
        };
    } catch (error) {
        console.log(error);
    }

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
            const { data } = await API.get("/login/view", {
                withCredentials: true
            });
            if (data.grade === '3') {
                back.style.display = 'block';
            } else {
                back.style.display = 'none';
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
            API.post('./chat/chat_insert', messageData, {
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
        const { data } = await API.post('/login', { user_id, user_pw }, {
            withCredentials: true
        });
        console.log(data);
        if (data == '가입 안한 아이디 입니다.' || data == '비번 틀림') {
            alert(data);
        }else if(data.msg == `승인이 거절되었습니다.\n회원가입을 다시 진행해주세요.` || data.msg == '가입 승인 대기중입니다.'){
            alert(data.msg);
        } else {
            setCookie('login',data.token,30);
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

toSignUp.addEventListener ('click', () => {
    location.href = `./signUp${urlEnd}`;
})

const Logo = document.querySelector('.logo').addEventListener('click', () => {
    location.href = `./${mainUrl}`;
})

mypageBtn.addEventListener('click', () => {
    location.href = `./mypage${urlEnd}`;
})

////////////////////////////// 메인 게시판 영역 ////////////////////////////////////

async function GetAPI(currentPage){
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
        _tr1.append(_th1,_th2,_th3,_th4,_th5,_th6);
        post_list.append(_tr1);

        btns.innerHTML = '';
        
        const {data} = await API.get('/post',{
            headers : {
                'Content-Type' : "application/json"
            }
        });

        let pageOffset = 10;
        let pageGroup = currentPage * pageOffset;
        let pageNum = 0;

        if(data == null){
            return;
        }else{
            data.forEach((el,index)=>{
                if(index % pageOffset == 0){
                    let btn = document.createElement('button');
                    btn.innerHTML = index / 10 + 1;
                    btn.className = 'pageBtn';
                    btn.onclick = ()=>{
                        pageNum = index;
                        GetAPI(index / pageOffset);
                    }
                    btns.append(btn);
                }
            })
            
            const _data = data.slice(pageGroup,pageGroup + pageOffset);

            _data.forEach((el,index) => {
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

                let createDate = Number(el.createdAt.slice(0,10).split('-').join(''));
                let updateDate = Number(el.updatedAt.slice(0,10).split('-').join(''));

                let _tr = document.createElement('tr');
                let _td1 = document.createElement('td');
                let _td2 = document.createElement('td');
                let _td3 = document.createElement('td');
                let _td4 = document.createElement('td');
                let _td5 = document.createElement('td');
                let _td6 = document.createElement('td');
                _td1.innerHTML = index + 1;
                _td2.innerHTML = el.title;
                _td3.innerHTML = el.User.nickname;

                if(nowdate > createDate){
                    _td4.innerHTML = el.createdAt.slice(0,10);
                }else{
                    _td4.innerHTML = el.createdAt.slice(11,19);
                }

                if(nowdate > updateDate){
                    _td5.innerHTML = el.updatedAt.slice(0,10);
                }else{
                    _td5.innerHTML = el.updatedAt.slice(11,19);
                }

                _td6.innerHTML = el.postViews;

                _tr.onclick = async()=>{
                    await API.post('./post/detail',{
                        headers : {
                            'Content-Type' : "application/json"
                        },
                        data : el.id
                    }).then((e)=>{
                        location.href = e.data;
                    }).catch((err)=>{
                        console.log(err);
                    })
                }

                _tr.append(_td1,_td2,_td3,_td4,_td5,_td6);
                post_list.append(_tr);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

GetAPI(0);

// 전체 글 목록 페이지로 이동 = 메인 페이지
const usedMarket = document.querySelector('.used-market');

usedMarket.onclick= ()=>{
    location.href = `./${mainUrl}`;
}

const toInsert = document.getElementById('inInsert');

toInsert.onclick = ()=>{
    location.href = `./insert${urlEnd}`;
}