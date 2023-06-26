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

async function ChattingOnload () {
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

////////////////////////// 통계 영역 ///////////////////////////
let posts;
let views;
let likes;

// 성비 차트
let config1 = {
    type: 'bar',
    data: {
        labels: [
            '남성', '여성'
        ],
        datasets: [
            {
                label: '',
                data: [
                    'male',
                    'female'
                ],
                backgroundColor: [
                    '#82beff',
                    '#ffaff2'
                ],
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: '남여 성비 (조회수)',
                font: {
                    size: 13
                }
            },
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                ticks: {
                    font: {
                        size: 13
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 13
                    }
                }
            }
        }
    }
};

// 차트 작성 기본 데이터
let config2 = {
    type: 'bar',
    data: {
        labels: [
            'test'
        ],
        datasets: [
            {
                label: '조회수',
                fill: false,
                data: [
                    1
                ],
                backgroundColor: [
                    '#82beff'
                ]
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: '기간별 조회수',
                font: {
                    size: 13
                }

            },
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                ticks: {
                    font: {
                        size: 13
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 13
                    }
                }
            }
        }
    }
};

const postList = document.getElementById('list_up');

async function GetStat(currentPage) {
    const { data } = await API.get('/statistic');

    postList.innerHTML = '';

    let _tr = document.createElement('tr');
    let _th1 = document.createElement('th');
    let _th2 = document.createElement('th');
    let _th3 = document.createElement('th');

    _th1.innerHTML = 'No.';
    _th2.innerHTML = '제목';
    _th3.innerHTML = '작성자';

    _tr.append(_th1, _th2, _th3);
    postList.append(_tr);

    btns.innerHTML = '';

    let pageOffset = 10;
    let pageGroup = currentPage * pageOffset;
    let pageNum = 0;


    if (data == null) {
        return;
    } else {
        posts = data;

        data.forEach((el, index) => {
            if (index % pageOffset == 0) {
                let btn = document.createElement('button');
                btn.innerHTML = index / 10 + 1;
                btn.className = 'pageBtn';
                btn.onclick = () => {
                    pageNum = index;
                    GetStat(index / pageOffset);
                }
                btns.append(btn);
            }
        })

        const _data = data.slice(pageGroup, pageGroup + pageOffset);

        _data.forEach((el, index) => {
            let _tr1 = document.createElement('tr');
            let _td1 = document.createElement('td');
            let _td2 = document.createElement('td');
            let _td3 = document.createElement('td');

            _td1.innerHTML = index + 1;
            _td2.innerHTML = el.title;
            _td3.innerHTML = el.User.nickname;
            _tr1.style.cursor = 'pointer';

            _tr1.append(_td1, _td2, _td3);

            _tr1.onclick = () => {
                PostStatData(el.id);
            }

            postList.append(_tr1);
        })
    }
}

GetStat(0);

const selectBtn = document.getElementById('selectRange');

async function PostStatData(id) {
    await API.post('/statistic', {
        data: id
    }).then((e) => {
        const graphArea = document.getElementById('view_graph_area');
        const genderArea = document.getElementById('gender_graph_area');
        const viewCount = document.querySelector('.view_count');
        const likeCount = document.querySelector('.like_count');
        const viewGraph = document.getElementById('view_graph');
        const genderRate = document.getElementById('gender_rate');

        graphArea.removeChild(viewGraph);
        genderArea.removeChild(genderRate);


        const _canvas1 = document.createElement('canvas');
        const _canvas2 = document.createElement('canvas');
        _canvas1.id = 'gender_rate';
        _canvas2.id = 'view_graph';

        _canvas1.style = 'width : 400px; height : 200px;';

        views = e.data.views;
        likes = e.data.likes;

        viewCount.innerHTML = e.data.views.length;
        likeCount.innerHTML = e.data.likes.length;

        // 성별 구분
        let genderArr = [[], []];

        views.forEach((el) => {
            if (el.User.gender == 'male') {
                genderArr[0].push(el);
            } else if (el.User.gender == 'female') {
                genderArr[1].push(el);
            }
        })

        config1.data.datasets[0].data = [
            genderArr[0].length,
            genderArr[1].length
        ];

        let chart1 = new Chart(_canvas1, config1);

        genderArea.append(_canvas1);

        // 현재 시간 확인
        let nowDate = new Date();
        let nowMonth = nowDate.getMonth() < 10 ? `0${nowDate.getMonth()}` : `${nowDate.getMonth()}`;
        let today = nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : `${nowDate.getDate()}`;
        let todayDate = Number(`${nowMonth}${today}`);

        let dateArr = [[], [], [], [], [], [], []];

        e.data.views.forEach((el) => {
            let viewDate = new Date(el.createdAt);
            let viewMonth = viewDate.getMonth() < 10 ? `0${viewDate.getMonth()}` : `${viewDate.getMonth()}`;
            let viewDay = viewDate.getDate() < 10 ? `0${viewDate.getDate()}` : `${viewDate.getDate()}`;
            let viewDateNum = Number(`${viewMonth}${viewDay}`);

            if (todayDate - viewDateNum == 0) {
                dateArr[0].push(viewDateNum);
            } else if (todayDate - viewDateNum == 1) {
                dateArr[1].push(viewDateNum);
            } else if (todayDate - viewDateNum == 2) {
                dateArr[2].push(viewDateNum);
            } else if (todayDate - viewDateNum == 3) {
                dateArr[3].push(viewDateNum);
            } else if (todayDate - viewDateNum == 4) {
                dateArr[4].push(viewDateNum);
            } else if (todayDate - viewDateNum == 5) {
                dateArr[5].push(viewDateNum);
            } else if (todayDate - viewDateNum == 6) {
                dateArr[6].push(viewDateNum);
            }
        })

        // 선택 상자 옵션 설정
        selectBtn.innerHTML = '<option>기간</option>';
        const opt1 = document.createElement('option');
        const opt2 = document.createElement('option');
        opt1.text = '주간';
        opt1.value = 'week';
        opt2.text = '일간';
        opt2.value = 'day';
        selectBtn.append(opt1, opt2);

        // 그래프 x축 표기
        let labeldata = [];
        for (let i = 0; i < 7; i++) {
            let date = nowDate.getDate() - i < 10 ? `0${nowDate.getDate() - i}` : `${nowDate.getDate() - i}`;
            labeldata.push(nowMonth + '/' + date);
        }

        config2.data.labels = [
            labeldata[6],
            labeldata[5],
            labeldata[4],
            labeldata[3],
            labeldata[2],
            labeldata[1],
            labeldata[0]
        ];

        config2.data.datasets[0].data = [
            dateArr[6].length,
            dateArr[5].length,
            dateArr[4].length,
            dateArr[3].length,
            dateArr[2].length,
            dateArr[1].length,
            dateArr[0].length
        ];

        let chart2 = new Chart(_canvas2, config2);

        graphArea.append(_canvas2);
    }).catch((err) => {
        console.log(err);
    })
}

// 선택 상자 변경 시 차트 변경
selectBtn.onchange = async (e) => {
    const select = e.target.value;
    console.log()

    if (views != null) {
        await API.post('/statistic', {
            data: views[0].postId
        }).then((e) => {
            const graphArea = document.getElementById('view_graph_area');
            const viewGraph = document.getElementById('view_graph');

            graphArea.removeChild(viewGraph);

            const _canvas2 = document.createElement('canvas');
            _canvas2.id = 'view_graph';

            let nowDate = new Date();


            if (select == 'week') {
                // 현재 시간 확인
                let nowMonth = nowDate.getMonth() < 10 ? `0${nowDate.getMonth()}` : `${nowDate.getMonth()}`;
                let today = nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : `${nowDate.getDate()}`;
                let todayDate = Number(`${nowMonth}${today}`);

                let dateArr = [[], [], [], [], [], [], []];

                e.data.views.forEach((el) => {
                    let viewDate = new Date(el.createdAt);
                    let viewMonth = viewDate.getMonth() < 10 ? `0${viewDate.getMonth()}` : `${viewDate.getMonth()}`;
                    let viewDay = viewDate.getDate() < 10 ? `0${viewDate.getDate()}` : `${viewDate.getDate()}`;
                    let viewDateNum = Number(`${viewMonth}${viewDay}`);

                    if (todayDate - viewDateNum == 0) {
                        dateArr[0].push(viewDateNum);
                    } else if (todayDate - viewDateNum == 1) {
                        dateArr[1].push(viewDateNum);
                    } else if (todayDate - viewDateNum == 2) {
                        dateArr[2].push(viewDateNum);
                    } else if (todayDate - viewDateNum == 3) {
                        dateArr[3].push(viewDateNum);
                    } else if (todayDate - viewDateNum == 4) {
                        dateArr[4].push(viewDateNum);
                    } else if (todayDate - viewDateNum == 5) {
                        dateArr[5].push(viewDateNum);
                    } else if (todayDate - viewDateNum == 6) {
                        dateArr[6].push(viewDateNum);
                    }
                })

                let labeldata = [];
                for (let i = 0; i < 7; i++) {
                    let date = nowDate.getDate() - i < 10 ? `0${nowDate.getDate() - i}` : `${nowDate.getDate() - i}`;
                    labeldata.push(nowMonth + '/' + date);
                }

                config2.data.labels = [
                    labeldata[6],
                    labeldata[5],
                    labeldata[4],
                    labeldata[3],
                    labeldata[2],
                    labeldata[1],
                    labeldata[0]
                ];

                config2.data.datasets[0].data = [
                    dateArr[6].length,
                    dateArr[5].length,
                    dateArr[4].length,
                    dateArr[3].length,
                    dateArr[2].length,
                    dateArr[1].length,
                    dateArr[0].length
                ];

            } else {
                // 현재 시간 확인
                let today = nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : `${nowDate.getDate()}`;
                let nowHour = nowDate.getHours() < 10 ? `0${nowDate.getHours()}` : `${nowDate.getHours()}`;
                let todayDate = Number(nowHour) + 24;

                let dateArr = [[], [], [], [], [], [], []];

                e.data.views.forEach((el) => {
                    // 조회 수 시간
                    let viewDate = new Date(el.createdAt);
                    let viewDay = viewDate.getDate() < 10 ? `0${viewDate.getDate()}` : `${viewDate.getDate()}`;
                    let viewHour = viewDate.getHours() < 10 ? `0${viewDate.getHours()}` : `${viewDate.getHours()}`;
                    let viewDateNum;
                    if (viewDay == today) {
                        viewDateNum = Number(viewHour) + 24;
                    } else {
                        viewDateNum = Number(viewHour);
                    }

                    if (todayDate - viewDateNum >= 0 && todayDate - viewDateNum < 4) {
                        dateArr[0].push(viewDateNum);
                    } else if (todayDate - viewDateNum >= 4 && todayDate - viewDateNum < 8) {
                        dateArr[1].push(viewDateNum);
                    } else if (todayDate - viewDateNum >= 8 && todayDate - viewDateNum < 12) {
                        dateArr[2].push(viewDateNum);
                    } else if (todayDate - viewDateNum >= 12 && todayDate - viewDateNum < 16) {
                        dateArr[3].push(viewDateNum);
                    } else if (todayDate - viewDateNum >= 16 && todayDate - viewDateNum < 20) {
                        dateArr[4].push(viewDateNum);
                    } else if (todayDate - viewDateNum >= 20 && todayDate - viewDateNum < 24) {
                        dateArr[5].push(viewDateNum);
                    } else if (todayDate - viewDateNum >= 24 && todayDate - viewDateNum < 28) {
                        dateArr[6].push(viewDateNum);
                    }
                })

                let labeldata = [];
                for (let i = 4; i <= 28; i += 4) {
                    let time;
                    let dayTime;
                    let compareTime = nowDate.getHours();

                    if (i > compareTime) {
                        dayTime = Number(today) - 1;

                        time = nowDate.getHours() - i + 24 >= 10 ? `${nowDate.getHours() - i + 24}` : `0${nowDate.getHours() - i + 24}`;

                        labeldata.push(dayTime + '일 ' + time + '시');
                    } else {
                        time = nowDate.getHours() - i >= 10 ? `${nowDate.getHours() - i}` : `0${nowDate.getHours() - i}`;

                        labeldata.push(today + '일 ' + time + '시');
                    }

                }
                console.log(dateArr)

                config2.data.labels = [
                    labeldata[6],
                    labeldata[5],
                    labeldata[4],
                    labeldata[3],
                    labeldata[2],
                    labeldata[1],
                    labeldata[0]
                ];

                config2.data.datasets[0].data = [
                    dateArr[6].length,
                    dateArr[5].length,
                    dateArr[4].length,
                    dateArr[3].length,
                    dateArr[2].length,
                    dateArr[1].length,
                    dateArr[0].length
                ];
            }

            let chart = new Chart(_canvas2, config2);

            graphArea.append(_canvas2);

        }).catch((err) => {
            console.log(err);
        })
    }
}