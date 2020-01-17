const connection = require("../config/connection.js");
const debug = require('../server.js');

// internal API to mySQL. implements CRUD.
let orm = {
  
  all: (table, cb) => {
    let queryStr = `SELECT * FROM ${table};`;
    connection.query(queryStr, (err, res) => {if (err) {throw err;} cb(res);});
  },
  
  create: (table, cols, vals, cb) => {
    let queryStr = `INSERT INTO ${table} (${cols.join(',')}) VALUES (?${',?'.repeat(vals.length-1)}) `;

    if (debug) console.log(vals.length, queryStr);

    connection.query(queryStr, vals, (err, res) => {
      if (err) {throw err;} cb(res);});
  },

  update: (table, objColVals, condition, cb) => {
    let queryStr = `UPDATE ${table} SET `;

    let arr = [];
    for (let prop in objColVals) {
      arr.push(`${prop} = "${objColVals[prop]}"`);
    }  
    queryStr += `${arr.join(',')} WHERE ${condition}`;

    if (debug) console.log(queryStr);

    connection.query(queryStr, (err, res) => {if (err) {throw err;} cb(res);});
  },

  delete: (table, condition, cb) => {
    let queryStr = `DELETE FROM ${table} WHERE ${condition}`;

    if (debug) console.log(queryStr);

    connection.query(queryStr, (err, res) => {if (err) {throw err;} cb(res);});
  }
};

// Export the orm object for the model (cat.js).
module.exports = orm;
