const config = require('../config');
const Sequelize = require('sequelize');
const Admin = require('./admin');
const Join = require('./join');

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

Admin.init(sequelize);
Join.init(sequelize);

module.exports = db;