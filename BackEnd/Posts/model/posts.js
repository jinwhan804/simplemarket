const Sequelize = require('sequelize');

class Posts extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title : {
                type : Sequelize.STRING(30),
                allowNull : false
            },
            content : {
                type : Sequelize.STRING(256),
            },
            userId : {
                type : Sequelize.INTEGER,
                allowNull : false
            },
            nickname : {
                type : Sequelize.STRING(30),
                allowNull : false
            },
            userImg : {
                type : Sequelize.STRING(100),
                allowNull : false
            },
            postLikes: {
                type : Sequelize.STRING(256),
                defaultValue : 0
            },
            postViews :{
                type : Sequelize.INTEGER,
                defaultValue : 0
            }
        },{
            sequelize,
            timestamps : true,
            underscored :false,
            modelName : "Post",
            tableName : "posts",
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }
}

module.exports = Posts;