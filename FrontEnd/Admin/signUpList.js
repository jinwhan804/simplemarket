async function getUserInfo() {
    try {
        let userInfo = document.querySelector('.list_user');
        const { data } = await axios.get('http://127.0.0.1:8080/signUp', {
            withCredentials: true,
        });
        console.log(data);
        userInfo.innerHTML = "";
        data.forEach((el, index) => {
            let date = new Date(data[index].createdAt);
            let formattedDate = date.toLocaleDateString() + '<br>' + date.toLocaleTimeString();
            userInfo.innerHTML += `
            <div class="user">
                <div class="num">${index + 1}</div>
                <div class="id">${data[index].user_id}</div>
                <div class="name">${data[index].name}</div>
                <div class="nickName">${data[index].nickname}</div>
                <div class="gender">${data[index].gender}</div>
                <div class="address">${data[index].address}</div>
                <div class="pass"><button class="accept" onclick="approveUser('${data[index].user_id}')">승인</button> <button class="reject">거절</button></div>
                <div class="reqDate">${formattedDate}</div>
                <div class="resDate"></div>
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
        await axios.post('http://127.0.0.1:8080/signUpList/approve_user', { user_id }, {
            withCredentials: true
        });
        getUserInfo();
    } catch (error) {
        console.log(error);
    }
}

// 회원가입 요청에 대한 거절 코드
async function rejectUser(user_id, e) {
    try {
        const response = await axios.post('http://127.0.0.1:8080/signUpList/reject_user', { user_id }, {
            withCredentials: true
        });
        const rejectDate = new Date(response.data.rejectDate);
        const formattedDate = rejectDate.toLocaleDateString() + '<br>' + rejectDate.toLocaleTimeString();
        e.target.closest('.user').querySelector('.resDate').innerHTML = formattedDate;
        getUserInfo();
    } catch (error) {
        console.log(error);
    }
}

// 승인과 거절했을 시 실행되는 함수
document.querySelector('.list_user').addEventListener('click', (e) => {
    const userId = e.target.closest('.user').querySelector('.id').innerText;
    if (e.target.className === 'accept') {
        approveUser(userId);
    } else if (e.target.className === 'reject') {
        const reason = prompt('거절 사유를 입력해주세요');
        console.log(reason);
        if (reason != null) {
            rejectUser(userId);
            e.target.closest('.user').querySelector('.pass').innerHTML = "<span style='color:red;'>거절됨</span>"
        }
    }
});
