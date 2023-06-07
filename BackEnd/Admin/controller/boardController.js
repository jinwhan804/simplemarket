const { Join, User, sequelize } = require('../model');

exports.boardMain = async (req, res) => {
    try {
        const users = await Join.findAll({});
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

exports.approveUser = async (req, res) => {
    const { user_id } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const joinUser = await Join.findOne({ where: { user_id } });
        await User.create({ ...joinUser.dataValues }, { transaction });
        await Join.destroy({ where: { user_id } }, { transaction });
        await transaction.commit();
        res.send('승인되었습니다.');
    } catch (error) {
        await transaction.rollback();
        console.log(error);
    }
}