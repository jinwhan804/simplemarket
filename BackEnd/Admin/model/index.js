const config = require('../config');
const Sequelize = require('sequelize');
const Admin = require('./admin');
const Join = require('./join');
const User = require('./user')

const sequelize = new Sequelize(
    config.dev.database,
    config.dev.username,
    config.dev.password,
    config.dev
);

const db = {};
db.sequelize = sequelize;
db.Admin = Admin;
db.Join = Join;
db.User = User;

Admin.init(sequelize);
Join.init(sequelize);
User.init(sequelize);

module.exports = db;