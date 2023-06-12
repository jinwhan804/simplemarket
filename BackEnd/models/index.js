const Sequelize = require("sequelize");
const config = require("../config");
const User = require("./users");
const Post = require('./posts');
const Chat = require('./chatting');

const sequelize = new Sequelize(
    config.dev.database,
    config.dev.username,
    config.dev.password,
    config.dev
)

const db = {};
db.sequelize = sequelize;

db.Post = Post;
db.User = User;
db.Chat = Chat;

Post.init(sequelize);
User.init(sequelize);
Chat.init(sequelize);

Post.associationsUser(db);
User.associate(db);
Chat.associate(db);

module.exports = db;