// 관리자 게시판 기능 (유저만 안보이게)
async function checkAdmin() {
    const adminHide = document.getElementById('admin-hide');
    const {data} = await API.get("/login/view", {
    withCredentials : true
    });
    if(data && data.grade == "3"){
        adminHide.style.display = "block";
    }else{
        adminHide.style.display = "none"
    }
}
// 로그아웃 기능 
const Logout = document.getElementById('logout');

Logout.addEventListener('click', async ()=> {
    try {
        const {data} = await API.get("/logout",{
            withCredentials : true,
        });
        if(data == "메인 페이지"){
            window.location.href = `./${mainUrl}`;
            alert("로그아웃 되었습니다.")
        }
    } catch (error) {
        console.log(error);
    }
})

// 로고 클릭 시 main으로 돌아가기
const logo = document.querySelector('.logo');
logo.onclick = ()=>{
    location.href = `./${mainUrl}`
}

// 어드민 버튼 기능
const admin_hide = document.getElementById('admin-hide');
admin_hide.onclick = ()=>{
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
        form.append("imgs", imgs.value);
        form.append("upload", file.files[0]);
        form.append("userId", "user_id");
        const { data } = await API.post('/upload', form, {
            headers : {"content-Type" : "multipart/form-data"},
            withCredentials : true
        });
        if(data === "디폴트 프로필"){
            window.location.href = `./mypage${urlEnd}`;
        }

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
                nickname: newNickname
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
        const {data} = await API.get("/login/view",{
            withCredentials : true,
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

    if (data.profile_img) {
        document.querySelector("img").src = "/img/" + data.profile_img;
    }

    } catch (error) {
        console.log(error)
    }
}

// right-side 에 보여지는 내가 쓴 글 타이틀

async function getUserPost(){
    try {
        const { data: posts } = await API.get("/post",{
            withCredentials : true,
        });
        const { data: userInfo } = await API.get("/login/view",{
            withCredentials : true,
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
            const { data } = await API.post(`/mypage/detail`,{
                data : post.id
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