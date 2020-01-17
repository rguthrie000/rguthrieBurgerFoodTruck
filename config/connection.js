// Set up MySQL connection.
var mysql = require("mysql");

var connection;
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
  host:     "localhost",
  port:     3306,
  user:     "root",
  password: "root",
  database: "burgerFT_db"
});

// Connect to our database
connection.connect((err) => {
  if (err) {console.error("error connecting: " + err.stack); return;}
  console.log(`Connected to mySQL.burgerFT_db, threadId ${connection.threadId}.`);
});

module.exports = connection;
