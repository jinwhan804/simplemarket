const { User } = require('../models'); // User 모델을 가져옵니다.

exports.uploadProfileImage = async (req, res) => {
    const { file } = req;  // 요청에서 file과 body를 추출합니다.
    const { access_decoded } = req;

    try {
        const user = await User.findOne({ where: { name: access_decoded.name } });
        // console.log(user);
        if (user) {
            const profile_img_url = `${process.env.DATABASE_HOST}/img/${file.filename}`;
            user.profile_img = profile_img_url;
            console.log(profile_img_url);
            await user.save();
        } else {
            res.send('업로드 실패');
        }
    } catch (error) {
        console.log(error);
    }
};