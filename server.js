// generic Node/Express/Handlebars startup file
// rguthrie, 20200117

// Dependencies
const express = require("express");
const exphbs  = require("express-handlebars");

// Configure Express and Handlebars
let PORT = process.env.PORT? process.env.PORT : 8080;
let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Tell express where to find route handling.
let routes = require("./controllers/burgerControl.js");
app.use(routes);

// Let's go to work!
app.listen(PORT, () => {console.log(`Serving http://localhost:${PORT}.`);});

