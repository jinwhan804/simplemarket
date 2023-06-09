async function getAPI() {
    try {
        const { data } = await axios.get("http://127.0.0.1:8080/login/view", {
            withCredentials: true,
        });
        // console.log(data);
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
            document.querySelector("img").src = "http://localhost:8080/img/" + data.profile_img;
        }

    } catch (error) {
        console.log(error)
    }
}
getAPI();


// -----------------------------------------실시간 채팅------------------------------------------------------

const chatBox = document.querySelector('.chatBox');
const chatBoxClose = document.querySelector('.close_chatBox');
const chatContent = document.querySelector('.chat_content');

function popup() {
    document.body.classList.toggle('active');
    chatBox.classList.add('active');
}

chatBoxClose.addEventListener('click', () => {
    document.body.classList.remove('active');
    chatBox.classList.remove('active');
})


// 채팅 소켓
window.onload = () => {
    const socket = io.connect("http://localhost:8080");
    socket.on('message', (data) => {
        let el = `
        <div>
            <p>${data.nickname}</p>
            <p>${data.message}</p>
            <p>${data.date}</p>
        </div>
        `;
        chatContent.innerHTML += el;
    })
    btn.onclick = () => {
        socket.emit('message', {
            name: nickname.value,
            message: message.value,
            date: new Date().toString()
        })
    }
}