const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(30),
                allowNull: false
            },
            content: {
                type: Sequelize.JSON,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "Post",
            tableName: "posts",
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Post.belongsTo(db.User, { foreignKey: "userId", TargetKey: "id" });
        db.Post.hasMany(db.Reply,{foreignKey : "postId", SourceKey : "id"});
        db.Post.hasMany(db.Stat,{foreignKey : "postId", SourceKey : "id"});
    }
}

module.exports = Post;