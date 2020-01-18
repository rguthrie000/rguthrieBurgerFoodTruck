// Route handling.
const express  = require("express");
const menuItem = require("../models/menu.js");

let router = express.Router();


// serve landing page and files in the /public hierarchy
router.get("/", (req, result) => {
  menuItem.all( (data) => {
    let hbsObject = { orders : data };
    result.render("index", hbsObject);
  });
});

router.post("/api/orders", (req, result) => {
  if (req.body.menuItem) {
    menuItem.create(["menuItem", "served"], [req.body.menuItem, req.body.served], (res) => {
  
      // Send back the ID of the new menuItem

      result.json({ id: res.order_id });
    });
  } else {
    // show success
    result.status(500);
  }
});

router.put("/api/orders/:id", (req, result) => {
  let condition = `order_id = ${req.params.id}`;

  menuItem.update({served: req.body.served}, condition, (res) => {
    result.status(res.changedRows? 200 : 404).end();
  });
});

router.delete("/api/orders/:id", (req, result) => {
  let condition = `order_id = ${req.params.id}`;

  menuItem.delete(condition, (res) => {
    result.status(res.affectedRows? 200 : 404).end();
  });
});

// Export routes for server.js to use.
module.exports = router;
