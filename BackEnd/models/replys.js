const Sequelize = require('sequelize');

class Reply extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            content : {
                type : Sequelize.STRING(256),
            }
        },{
            sequelize,
            timestamps : true,
            underscored :false,
            modelName : "Reply",
            tableName : "replys",
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }

    static associate(db){
        db.Reply.belongsTo(db.User,{foreignKey : "userId", TargetKey : "id"});
        db.Reply.belongsTo(db.Post,{foreignKey : "postId", TargetKey : "id"});
        db.Reply.hasMany(db.Rereply,{foreignKey : "replyId", SourceKey : 'id'});
        db.Reply.hasMany(db.Stat,{foreignKey : "replyId", SourceKey : 'id'});
    }
}

module.exports = Reply;