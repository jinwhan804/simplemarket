const Sequelize = require("sequelize");

class User extends Sequelize.Model {
    static init(seq) {
        return super.init({
            name : {
                type : Sequelize.STRING(20),
                allowNull : false,
            },
            age : {
                type : Sequelize.INTEGER,
                allowNull : false
            },
            user_id : {
                type : Sequelize.STRING(20),
                allowNull : true
            },
            user_pw : {
                type : Sequelize.STRING(64),
                allowNull : true
            },
            nickname : {
                type : Sequelize.STRING(30),
                allowNull : true
            },
            gender : {
                type : Sequelize.STRING(100),
                allowNull : true,
                defaultValue : 'Not provided'
            },
            address : {
                type : Sequelize.STRING(100),
                allowNull : true
            },
            profile_img : {
                type : Sequelize.STRING,
                allowNull: true
            }
        },{
            sequelize : seq,
            timestamps : true,
            underscored : false,
            modelName : "User",
            tableName : "users",
            paranoid : false,
            charset : "utf8",
            collate : "utf8_general_ci"
        })
    }
    // static associate(db) {
    //     db.User.hasMany(db.Post, {foreignKey : "user_id", SourceKey : "id"})
    // }
}

module.exports = User;