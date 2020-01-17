const express  = require("express");
const menuItem = require("../models/menu.js");
const debug = require('../server.js');


let router = express.Router();

// Route handling.

// serve landing page and files in the /public hierarchy
router.get("/", (req, result) => {
  menuItem.all( (data) => {
    let hbsObject = { orders : data };
    if (debug) console.log(hbsObject);
    result.render("index", hbsObject);
  });
});

router.post("/api/orders", (req, result) => {
  if (req.body.menuItem) {
    menuItem.create(["menuItem", "served"], [req.body.menuItem, req.body.served], (res) => {
  
      if (debug) console.log("new order", res.order_id);
      // Send back the ID of the new menuItem

      result.json({ id: res.order_id });
    });
  } else {
    result.status(500);
  }
});

router.put("/api/orders/:id", (req, result) => {
  let condition = `order_id = ${req.params.id}`;

  if (debug) console.log("condition", condition);

  menuItem.update({served: req.body.served}, condition, (res) => {
    result.status(res.changedRows? 200 : 404).end();
  });
});

router.delete("/api/orders/:id", (req, result) => {
  let condition = `order_id = ${req.params.id}`;

  if (debug) console.log("condition", condition);

  menuItem.delete(condition, (res) => {
    result.status(res.affectedRows? 200 : 404).end();
  });
});

// Export routes for server.js to use.
module.exports = router;
