const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(30),
                allowNull: false
            },
            content: {
                type: Sequelize.STRING(256),
            },
            postLikes: {
                type: Sequelize.STRING(256),
                allowNull : true
            },
            postViews: {
                type: Sequelize.INTEGER,
                defaultValue: 0
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
        db.Post.hasMany(db.Reply,{foreignKey : "postId", TargetKey : "id"});
    }
}

module.exports = Post;