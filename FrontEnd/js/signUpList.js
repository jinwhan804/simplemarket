async function getUserInfo() {
    try {
        let userInfo = document.querySelector('.list_user');
        const { data } = await API.get('/admin/signUp', {
            withCredentials: true,
        });
        console.log(data);
        userInfo.innerHTML = "";
        data.forEach((user, index) => {
            let date = new Date(user.createdAt);
            let requestedDate = date.toLocaleDateString() + '<br>' + date.toLocaleTimeString();
            userInfo.innerHTML += `
            <div class="user">
                <div class="num">${index + 1}</div>
                <div class="id">${user.user_id}</div>
                <div class="name">${user.name}</div>
                <div class="nickName">${user.nickname}</div>
                <div class="gender">${user.gender}</div>
                <div class="address">${user.address}</div>
                <div class="reqDate">${requestedDate}</div>
                <div class="pass">
                    <button class="accept" onclick="approveUser('${user.user_id}')">승인</button>
                    <button class="reject" onclick="rejectUser('${user.user_id}')">거절</button>
                </div>
            </div>
            `
        });
    } catch (error) {
        console.log(error);
    }
}
getUserInfo();


// 회원가입 요청에 대한 승인 코드
async function approveUser(user_id) {
    try {
        await API.post('/signUpList/approve_user', { user_id }, {
            withCredentials: true
        });
        getUserInfo();
    } catch (error) {
        console.log(error);
    }
}

// 회원가입 요청에 대한 거절 코드
async function rejectUser(user_id) {
    try {
        await API.post('/signUpList/reject_user', { user_id }, {
            withCredentials: true
        });
        getUserInfo();
    } catch (error) {
        console.log(error);
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

const usedMarket = document.querySelector('.used-market');

usedMarket.onclick= ()=>{
    location.href = `./${mainUrl}`;
}

// 동네 장터 이동
const localMarket = document.querySelector('.local-market');

localMarket.onclick = ()=>{
    location.href = `./local${urlEnd}`;
}

// 통계 페이지 이동
const postStat = document.querySelector('.post-stat');

postStat.onclick = ()=>{
    location.href = `./statistic${urlEnd}`;
}