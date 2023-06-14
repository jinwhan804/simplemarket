// 로컬 주소 (확인할 것)
const serverUrl = 'http://127.0.0.1:8080'

// // 인스턴스 탄력적 IP
// const serverUrl = '3.35.211.37'

const API = axios.create({
    baseURL : serverUrl,
    headers : {
        'Content-Type' : 'application/json'
    },
    withCredentials : true
})