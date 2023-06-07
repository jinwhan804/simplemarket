async function getUserInfo() {
    try {
        let userInfo = document.querySelector('.list_user');
        const { data } = await axios.get('http://127.0.0.1:8080/signUp', {
            withCredentials: true,
        });
        console.log(data);
        data.forEach((el, index) => {
            userInfo.innerHTML += `
            <div class="user">
                <div class="num">${index + 1}</div>
                <div class="id">${data[index].user_id}</div>
                <div class="name">${data[index].name}</div>
                <div class="nickName">${data[index].nickname}</div>
                <div class="gender">${data[index].gender}</div>
                <div class="address">${data[index].address}</div>
                <div class="pass"><button onclick="approveUser('${data[index].id}')">승인</button></div>
            </div>
            `
        });
    } catch (error) {
        console.log(error);
    }
}
getUserInfo();

async function approveUser(user_id) {
    try {
        await axios.post('http://127.0.0.1:8080/approve_user', { user_id }, {
            withCredentials: true
        });
        getUserInfo();
    } catch (error) {
        console.log(error);
    }
}

document.querySelector('.user_list').addEventListener('click', (e) => {
    if (e.target.tagName === 'button') {
        const userId = e.target.closest('.user').querySelector('.id').innerText;
        approveUser(userId);
    }
});