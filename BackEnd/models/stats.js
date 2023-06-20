const Sequelize = require('sequelize');

class Stat extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            stat_type: {
                type: Sequelize.STRING(30),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "Stat",
            tableName: "stats",
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Stat.belongsTo(db.User, { foreignKey: "userId", TargetKey: "id" });
        db.Stat.belongsTo(db.Post,{foreignKey : "postId", TargetKey : "id"});
        db.Stat.belongsTo(db.Reply,{foreignKey : "replyId", TargetKey : "id"});
        db.Stat.belongsTo(db.Rereply,{foreignKey : "rereplyId", TargetKey : "id"});
    }
}

module.exports = Stat;