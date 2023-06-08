const config = require('../config');
const Sequelize = require('sequelize');
const Post = require('./posts');
const User = require('./users');

const sequelize = new Sequelize(
    config.dev.database,
    config.dev.username,
    config.dev.password,
    config.dev
);

const db = {};
db.sequelize = sequelize;
db.Post = Post;
db.User = User;

Post.init(sequelize);
User.init(sequelize);

Post.associationsUser(db);
User.associate(db);

module.exports = db;