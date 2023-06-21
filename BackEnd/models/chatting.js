const Sequelize = require('sequelize');

class Chat extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            message: {
                type: Sequelize.STRING,
                allowNull: false
            },
            receiver: {
                type: Sequelize.STRING,
                allowNull: false
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
        db.Chat.belongsTo(db.User, { foreignKey: 'sender', targetKey: 'id' });
        // db.Chat.belongsTo(db.User, { foreignKey: 'receiver', targetKey: 'id' });
    }
}

module.exports = Chat;