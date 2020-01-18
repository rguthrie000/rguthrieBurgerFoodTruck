// Object-Relational Mapping (ORM) implementation for JS <--> mySQL
// Uses the mysql npm package.

const connection = require("../config/connection.js");
const debug = require('../server.js');

// internal API to mySQL. implements CRUD.
let orm = {
  // mySQL:  SELECT * FROM table;
  all: (table, cb) => {
    let queryStr = `SELECT * FROM ${table};`;
    connection.query(queryStr, (err, res) => {if (err) {throw err;} cb(res);});
  },
  
  // mySQL: INSERT INTO table (columns) VALUES (matching values);
  create: (table, cols, vals, cb) => {
    let queryStr = `INSERT INTO ${table} (${cols.join(',')}) VALUES (?${',?'.repeat(vals.length-1)}) `;

    if (debug) console.log(vals.length, queryStr);

    connection.query(queryStr, vals, (err, res) => {
      if (err) {throw err;} cb(res);});
  },
  
  // mySQL: UPDATE table SET (column=value pairs) WHERE condition;
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

  // mySQL: DELETE FROM table WHERE condition;
  delete: (table, condition, cb) => {
    let queryStr = `DELETE FROM ${table} WHERE ${condition}`;

    if (debug) console.log(queryStr);

    connection.query(queryStr, (err, res) => {if (err) {throw err;} cb(res);});
  }
};

module.exports = orm;
