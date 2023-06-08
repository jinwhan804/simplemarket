const { User } = require('../model'); // User 모델을 가져옵니다.

exports.uploadProfileImage = async (req, res) => {
    const { file, body } = req;  // 요청에서 file과 body를 추출합니다.
    const { access_decoded } = req;
    
    const user = await User.findOne({ where: { name: access_decoded.name } });
    // console.log(user)
    if (!user) {
        // 해당 ID를 가진 사용자가 없다면 에러 메시지와 함께 400 상태 코드를 반환합니다.
        return res.status(400).send('User not found');
    }
    if(!req.file) {
        req.file = {
            filename: 'defaultprofile.png'
        }
        req.send("디폴트 프로필")
    }

    // 찾은 사용자의 프로필 이미지 경로를 업로드한 파일의 경로로 업데이트합니다.
    await user.update({ profile_img: file.filename });

    // 업데이트가 성공적으로 이루어졌음을 클라이언트에 알리고, 새로운 이미지의 경로도 같이 보내줍니다.
    res.send();
};