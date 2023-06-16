const Sequelize = require('sequelize');

class Rereply extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            content : {
                type : Sequelize.STRING(256),
            },
            rereplyLikes: {
                type : Sequelize.STRING(256),
            }
        },{
            sequelize,
            timestamps : true,
            underscored :false,
            modelName : "Rereply",
            tableName : "rereplys",
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }

    static associate(db){
        db.Rereply.belongsTo(db.User,{foreignKey : "userId", TargetKey : "id"});
        db.Rereply.belongsTo(db.Reply,{foreignKey : "replyId", TargetKey : "id"});
    }
}

module.exports = Rereply;