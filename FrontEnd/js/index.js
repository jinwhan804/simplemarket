// 로컬 주소 (확인할 것)
const serverUrl = 'http://127.0.0.1:3030';
const urlEnd = '.html';
const mainUrl = 'main.html';

// 인스턴스 탄력적 IP
// const serverUrl = 'http://3.35.211.37';
// const urlEnd = '';
// const mainUrl = '';

const API = axios.create({
    baseURL: serverUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

// 주소 값에 들어가는 데이터
const regionData = {
    "서울특별시": {
        "강남구": ["논현동", "삼성동", "청담동"],
        "서초구": ["반포동", "양재동", "신사동"],
    },
    "부산광역시": {
        "해운대구": ["우동", "중동", "재송동"],
        "남구": ["대연동", "용호동", "문현동"],
    },
};