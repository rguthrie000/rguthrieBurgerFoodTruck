// Import the ORM to create functions that will interact with the database.
let orm = require("../config/orm.js");

// This is the MVC 'Model' implementation, which is very lightweight for
// this application.

// CREATE-READ-UPDATE-DELETE

let menuItem = {
  // READ
  all: (cb) => {
    orm.all   ("orders", (res) => {cb(res);});
  },
  // CREATE
  create: (cols, vals, cb) => {
    orm.create("orders", cols, vals, (res) => {cb(res);});
  },
  // UPDATE
  update: (objColVals, condition, cb) => {
    orm.update("orders", objColVals, condition, (res) => {cb(res);});
  },
  // DELETE
  delete: (condition, cb) => {
    orm.delete("orders", condition, (res) => {cb(res);});
  }
};

module.exports = menuItem;
