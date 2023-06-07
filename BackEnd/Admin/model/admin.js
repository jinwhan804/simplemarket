const Sequelize = require('sequelize');

class Admin extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            admin_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            admin_pw: {
                type: Sequelize.STRING,
                allowNull: false
            },
            admin_nickName: {
                type: Sequelize.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Admin',
            tableName: 'admin',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
}

module.exports = Admin;