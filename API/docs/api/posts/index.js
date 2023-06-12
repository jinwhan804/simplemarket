const insert = require("./insert");
const update = require('./update');
const postAll = require('./postAll');
const detail = require('./detail');
const del = require('./delete');

module.exports = {
  ...insert,
  ...update,
  ...postAll,
  ...detail,
  ...del
};