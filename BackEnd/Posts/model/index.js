const config = require('../config');
const Sequelize = require('sequelize');
const Posts = require('./posts');

const sequelize = new Sequelize(
    config.dev.database,
    config.dev.username,
    config.dev.password,
    config.dev
);

const db = {};
db.sequelize = sequelize;
db.Posts = Posts;

Posts.init(sequelize);

module.exports = db;