const { User, sequelize } = require('../models');

exports.boardMain = async (req, res) => {
    try {
        const users = await User.findAll({ where: { grade: '1' } });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}


exports.approveUser = async (req, res) => {
    const { user_id } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const joinUser = await User.findOne({ where: { user_id } });
        joinUser.grade = '2';
        await joinUser.save({ transaction });
        await transaction.commit();
        res.send('승인되었습니다.');
    } catch (error) {
        await transaction.rollback();
        console.log(error);
    }
}

exports.rejectUser = async (req, res) => {
    const { user_id } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const joinUser = await User.findOne({ where: { user_id } }, { transaction });
        joinUser.grade = '0';
        await joinUser.save({ transaction });
        await transaction.commit();
        res.send('거절되었습니다.');
    } catch (error) {
        await transaction.rollback();
        console.log(error);
    }
}

