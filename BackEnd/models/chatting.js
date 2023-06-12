const Sequelize = require('sequelize');

class Chat extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            user_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            nickname: {
                type: Sequelize.STRING,
                allowNull: false
            },
            message: {
                type: Sequelize.STRING,
                allowNull: false
            },
            profile_img: {
                type: Sequelize.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Chat',
            tableName: 'chatting',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Chat.belongsTo(db.User, { foreignKey: 'userInfo', targetKey: 'id' });
    }
}

module.exports = Chat;