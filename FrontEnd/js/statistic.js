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
            })
        })
    } catch (error) {
        console.error(error);
    }
}

function openChatBox(userNickname) {
    chatBox.classList.add('active');
}

window.onload = async () => {
    const { data } = await axios.get('http://127.0.0.1:8080/login/view', {
        withCredentials: true
    });
    console.log(data);
    const nickname = data.nickname;
    const room = data.id;
    console.log(nickname, room);


    const socket = io.connect(serverUrl);
    socket.emit('joinRoom', room, nickname);


    const getChatData = await axios.get(`http://127.0.0.1:8080/chat/all_chats`, {
        withCredentials: true
    });
    // console.log(getChatData);
    const chatData = getChatData.data;
    console.log(chatData);

    // 유저 채팅 목록들을 나타내는 코드
    chatData.forEach(data => {
        if (data.nickname === '심플관리자') {
            return;
        }

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



    btn.onclick = async () => {
        const messageData = {
            message: msg.value,
            sender: data.id,
            // receiver
        }
        socket.emit('message', nickname, room, messageData);
        msg.value = '';
        await axios.post('http://127.0.0.1:8080/chat/chat_insert', messageData, {
            withCredentials: true
        })
    }

    // chatBox 창의 뒤로가기 버튼(관리자만 보임)
    try {
        if (data.grade === '3') {
            back.style.display = 'block';
        } else {
            back.style.display = 'none';
        }
    } catch (error) {
        console.error(error);
    }

    // chatBox에서 chatList로 가는 버튼
    back.addEventListener('click', () => {
        chatList.classList.add('active');
        chatBox.classList.remove('active');
    });
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

////////////////////////// 통계 영역 ///////////////////////////
let posts;
let views;
let likes;

// 차트 작성 기본 데이터
let config = {            
    type : 'bar',
    data : {
        labels : [
            'test'
        ],
        datasets : [
            {
                label : '조회수',
                fill : false,
                data : [
                    1
                ],
                backgroundColor:[
                    '#82beff'
                ]
            }
        ]
    },
    options :{
        title : {
            display : true,
            text : '조회수 그래프'
        }
    }
};

const postList = document.getElementById('list_up');

async function GetStat(currentPage){
    const {data} = await API.get('/statistic');

    postList.innerHTML = '';

    let _tr = document.createElement('tr');
    let _th1 = document.createElement('td');
    let _th2 = document.createElement('td');
    let _th3 = document.createElement('td');

    _th1.innerHTML = 'No.';
    _th2.innerHTML = '제목';
    _th3.innerHTML = '작성자';

    _tr.append(_th1,_th2,_th3);
    postList.append(_tr);

    btns.innerHTML = '';

    let pageOffset = 10;
    let pageGroup = currentPage * pageOffset;
    let pageNum = 0;


    if(data == null){
        return;
    }else{
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

        _data.forEach((el,index)=>{
            let _tr1 = document.createElement('tr');
            let _td1 = document.createElement('td');
            let _td2 = document.createElement('td');
            let _td3 = document.createElement('td');

            _td1.innerHTML = index + 1;
            _td2.innerHTML = el.title;
            _td3.innerHTML = el.User.nickname;

            _tr1.append(_td1,_td2,_td3);

            _tr1.onclick = ()=>{
                PostStatData(el.id);
            }

            postList.append(_tr1);
        })
    }
}

GetStat(0);

const selectBtn = document.getElementById('selectRange');

async function PostStatData (id){
    await API.post('/statistic',{
        data : id
    }).then((e)=>{
        const graphArea = document.querySelector('.text-container');
        const viewCount = document.querySelector('.view_count');
        const likeCount = document.querySelector('.like_count');
        const viewGraph = document.getElementById('view_graph');

        graphArea.removeChild(viewGraph);

        const _canvas = document.createElement('canvas');
        _canvas.id = 'view_graph';

        views = e.data.views;
        likes = e.data.likes;

        viewCount.innerHTML = e.data.views.length;
        likeCount.innerHTML = e.data.likes.length;

        // 현재 시간 확인
        let nowDate = new Date();
        let nowMonth = nowDate.getMonth() < 10 ? `0${nowDate.getMonth()}` : `${nowDate.getMonth()}`;
        let today = nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : `${nowDate.getDate()}`;
        let todayDate = Number(`${nowMonth}${today}`);
        
        let dateArr = [[],[],[],[],[],[],[]];
        
        e.data.views.forEach((el)=>{
            let viewDate = new Date(el.createdAt);
            let viewMonth = viewDate.getMonth() < 10 ? `0${viewDate.getMonth()}` : `${viewDate.getMonth()}`;
            let viewDay = viewDate.getDate() < 10 ? `0${viewDate.getDate()}` : `${viewDate.getDate()}`;
            let viewDateNum = Number(`${viewMonth}${viewDay}`);

            if(todayDate - viewDateNum == 0){
                dateArr[0].push(viewDateNum);
            }else if(todayDate - viewDateNum == 1){
                dateArr[1].push(viewDateNum);
            }else if(todayDate - viewDateNum == 2){
                dateArr[2].push(viewDateNum);
            }else if(todayDate - viewDateNum == 3){
                dateArr[3].push(viewDateNum);
            }else if(todayDate - viewDateNum == 4){
                dateArr[4].push(viewDateNum);
            }else if(todayDate - viewDateNum == 5){
                dateArr[5].push(viewDateNum);
            }else if(todayDate - viewDateNum == 6){
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
        selectBtn.append(opt1,opt2);
        
        // 그래프 x축 표기
        let labeldata = [];
        for (let i = 0; i < 7; i++) {
            let date = nowDate.getDate() - i < 10 ? `0${nowDate.getDate() - i}` : `${nowDate.getDate() - i}`;
            labeldata.push(nowMonth + '/' + date);
        }

        config.data.labels = [
            labeldata[6],
            labeldata[5],
            labeldata[4],
            labeldata[3],
            labeldata[2],
            labeldata[1],
            labeldata[0]
        ];

        config.data.datasets[0].data = [
            dateArr[6].length,
            dateArr[5].length,
            dateArr[4].length,
            dateArr[3].length,
            dateArr[2].length,
            dateArr[1].length,
            dateArr[0].length
        ];

        let chart = new Chart(_canvas,config);

        graphArea.append(_canvas);
    }).catch((err)=>{
        console.log(err);
    })
}

// 선택 상자 변경 시 차트 변경
selectBtn.onchange = async(e)=>{
    const select = e.target.value;

    if(views != null){
        await API.post('/statistic',{
            data : views[0].postId
        }).then((e)=>{
            const graphArea = document.querySelector('.text-container');            
            const viewGraph = document.getElementById('view_graph');
    
            graphArea.removeChild(viewGraph);
            
            const _canvas = document.createElement('canvas');
            _canvas.id = 'view_graph';

            let nowDate = new Date();
            

            if(select == 'week'){
                // 현재 시간 확인
                let nowMonth = nowDate.getMonth() < 10 ? `0${nowDate.getMonth()}` : `${nowDate.getMonth()}`;
                let today = nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : `${nowDate.getDate()}`;
                let todayDate = Number(`${nowMonth}${today}`);
                
                let dateArr = [[],[],[],[],[],[],[]];
                
                e.data.views.forEach((el)=>{
                    let viewDate = new Date(el.createdAt);
                    let viewMonth = viewDate.getMonth() < 10 ? `0${viewDate.getMonth()}` : `${viewDate.getMonth()}`;
                    let viewDay = viewDate.getDate() < 10 ? `0${viewDate.getDate()}` : `${viewDate.getDate()}`;
                    let viewDateNum = Number(`${viewMonth}${viewDay}`);
        
                    if(todayDate - viewDateNum == 0){
                        dateArr[0].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 1){
                        dateArr[1].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 2){
                        dateArr[2].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 3){
                        dateArr[3].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 4){
                        dateArr[4].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 5){
                        dateArr[5].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 6){
                        dateArr[6].push(viewDateNum);
                    }
                })
                
                let labeldata = [];
                for (let i = 0; i < 7; i++) {
                    let date = nowDate.getDate() - i < 10 ? `0${nowDate.getDate() - i}` : `${nowDate.getDate() - i}`;
                    labeldata.push(nowMonth + '/' + date);
                }

                config.data.labels = [
                    labeldata[6],
                    labeldata[5],
                    labeldata[4],
                    labeldata[3],
                    labeldata[2],
                    labeldata[1],
                    labeldata[0]
                ];
        
                config.data.datasets[0].data = [
                    dateArr[6].length,
                    dateArr[5].length,
                    dateArr[4].length,
                    dateArr[3].length,
                    dateArr[2].length,
                    dateArr[1].length,
                    dateArr[0].length
                ];
                
            }else{
                // 현재 시간 확인
                let today = nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : `${nowDate.getDate()}`;
                let nowHour = nowDate.getHours() < 10 ? `0${nowDate.getHours()}` : `${nowDate.getHours()}`;
                let todayDate = Number(`${today}${nowHour}`);
                
                let dateArr = [[],[],[],[],[],[],[]];
                
                e.data.views.forEach((el)=>{
                    let viewDate = new Date(el.createdAt);
                    let viewDay = viewDate.getDate() < 10 ? `0${viewDate.getDate()}` : `${viewDate.getDate()}`;
                    let viewHour = viewDate.getHours() < 10 ? `0${viewDate.getHours()}` : `${viewDate.getHours()}`;
                    let viewDateNum = Number(`${viewDay}${viewHour}`);
        
                    if(todayDate - viewDateNum == 0){
                        dateArr[0].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 4){
                        dateArr[1].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 8){
                        dateArr[2].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 12){
                        dateArr[3].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 16){
                        dateArr[4].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 20){
                        dateArr[5].push(viewDateNum);
                    }else if(todayDate - viewDateNum == 24){
                        dateArr[6].push(viewDateNum);
                    }
                })
                
                let labeldata = [];
                for (let i = 0; i <= 24; i += 4) {
                    let time;
                    let dayTime;
                    let compareTime = nowDate.getHours();

                    if(i > compareTime){
                        dayTime = Number(today) - 1;

                        time = nowDate.getHours() - i + 24 >= 10 ? `${nowDate.getHours() - i + 24}` : `0${nowDate.getHours() - i + 24}`;

                        labeldata.push(dayTime + '일 ' + time + '시');
                    }else{
                        time = nowDate.getHours() - i >= 10 ? `${nowDate.getHours() - i}` : `0${nowDate.getHours() - i}`;

                        labeldata.push(today + '일 ' + time + '시');
                    }
                    
                }

                config.data.labels = [
                    labeldata[6],
                    labeldata[5],
                    labeldata[4],
                    labeldata[3],
                    labeldata[2],
                    labeldata[1],
                    labeldata[0]
                ];
        
                config.data.datasets[0].data = [
                    dateArr[6].length,
                    dateArr[5].length,
                    dateArr[4].length,
                    dateArr[3].length,
                    dateArr[2].length,
                    dateArr[1].length,
                    dateArr[0].length
                ];
            }
        
            let chart = new Chart(_canvas,config);
    
            graphArea.append(_canvas);
    
        }).catch((err)=>{
            console.log(err);
        })        
    }
}