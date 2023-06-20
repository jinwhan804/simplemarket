async function getUserInfo() {
    try {
        let userInfo = document.querySelector('.list_user');
        const { data } = await axios.get('http://127.0.0.1:8080/admin/signUp', {
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
        await axios.post('http://127.0.0.1:8080/signUpList/approve_user', { user_id }, {
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
        await axios.post('http://127.0.0.1:8080/signUpList/reject_user', { user_id }, {
            withCredentials: true
        });
        getUserInfo();
    } catch (error) {
        console.log(error);
    }
}
