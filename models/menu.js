// Import the ORM to create functions that will interact with the database.
let orm = require("../config/orm.js");

let menuItem = {
  all: (cb) => {
    orm.all   ("orders", (res) => {cb(res);});
  },
  create: (cols, vals, cb) => {
    orm.create("orders", cols, vals, (res) => {cb(res);});
  },
  update: (objColVals, condition, cb) => {
    orm.update("orders", objColVals, condition, (res) => {cb(res);});
  },
  delete: (condition, cb) => {
    orm.delete("orders", condition, (res) => {cb(res);});
  }
};

module.exports = menuItem;
