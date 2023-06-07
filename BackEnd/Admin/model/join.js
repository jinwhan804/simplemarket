const Sequelize = require('sequelize');

class Join extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            user_pw: {
                type: Sequelize.STRING,
                allowNull: null
            },
            nickName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'Not provided'
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Join',
            tableName: 'join',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
}

module.exports = Join;