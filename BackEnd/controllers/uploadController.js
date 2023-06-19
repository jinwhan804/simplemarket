const { User } = require('../models'); // User 모델을 가져옵니다.
const AWS = require('aws-sdk'); // 이미지 업로드할 클라우드 

// AWS SDK를 이용해서 S3 객체 생성
const s3 = new AWS.S3({
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
    region : process.env.AWS_REGION
});

exports.uploadProfileImage = async (req, res) => {
    const file = req.file;
    const { access_decoded } = req;
    if (!req.file) {
        return res.status(400).send('파일 업로드 자체가 안됐음');
    }
    
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // 사용할 S3 버킷명
        Key: file.originalname, // 저장할 파일명
        Body: file.buffer, // 업로드할 파일
        ACL: 'public-read' // 파일에 대한 접근 권한 설정. public-read로 설정하면 파일이 공개적으로 접근 가능하게 됩니다.
    };
    
    try {
        const user = await User.findOne({ where: { name: access_decoded.name } });
        if (!user) {
            return res.send('유저가 존재하지 않습니다');
        }
        
        s3.upload(params, async (err, data) => {
            if (err) {
                console.log('Error occurred while trying to upload to S3 bucket', err);
            }
            
            if (data) {
                user.profile_img = data.Location;
                await user.save();
                res.send('프로필 이미지 업로드에 성공하였습니다.');
            }
        });
    } catch (error) {
        console.log(error);
        res.send('업로드 실패');
    }
};
exports.uploadProfileImage2 = async (req, res) => {
    const file = req.file;
    if (!req.file) {
        return res.status(400).send('파일 업로드 자체가 안됐음');
    }
    
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // 사용할 S3 버킷명
        Key: file.originalname, // 저장할 파일명
        Body: file.buffer, // 업로드할 파일
        ACL: 'public-read' // 파일에 대한 접근 권한 설정. public-read로 설정하면 파일이 공개적으로 접근 가능하게 됩니다.
    };
    
    try {
        s3.upload(params, async (err, data) => {
            if (err) {
                console.log('Error occurred while trying to upload to S3 bucket', err);
            }
            
            if (data) {
                res.send('프로필 이미지 업로드에 성공하였습니다.');
            }
        });
    } catch (error) {
        console.log(error);
        res.send('업로드 실패');
    }
};

