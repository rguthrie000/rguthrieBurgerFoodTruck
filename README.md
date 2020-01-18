# rguthrieBurgerFoodTruck
Full Stack App to track posting and delivery of orders to a Food Truck. Future features will track supply
inventory and revenue.

Client: HTML/CSS/JS
Server: node+express, handlebars, mySQL.
Deployed on heroku, configuration control on github.

# Requirements

Functional requirements for a Minimum Viable Product:
* Build an in-house order tracker to be used by kitchen staff in a Food Truck or other quick-service application.

  * Orders are entered by the name of the dish, and posted to the kitchen.

  * Optionally, new orders can be entered to the Orders Served list to aid the cashier.

  * When ready to fill an order, kitchen staff uses a 'Serve' button to indicate the order is ready for delivery.

  * The 'Serve' button moves the order to the Orders Served list

  * Orders can be deleted from Orders In or Orders Served, but the normal process would be for the cashier/server
    to delete Orders from the Orders Served list.

  * Order preparation time is tracked per order, with greater than 5 minutes showing warning status (yellow) and 
    > 10 minutes showing urgent status (red).
    
# Design Notes

Design Requirements
* Orders must be tracked in a database.  Current functionality is simple, but a database baseline is needed to 
  quickly add functionality.

* Design simplicity and ease of use are important for acceptance of the Order Tracker.

# Database design

* Relationships:
  * Orders have an ID, a Menu Item, a Served/not Served status, and a creation time.
  * (Future) The Menu supports quick assignment of one or more menu items to an order at time of order creation.
  * (Future) New orders will take a customer identifier (name) to track delivery.
  
  DB tables

## This application was developed with:
VS Code - Smart Editor for HTML/CSS/JS
node.js - JavaScript command-line interpreter
express.js - JavaScript extension for server support
Google Chrome Inspector - inspection/analysis tools integrated in Chrome Browser.
DBeaver database viewer - mySQL database creation, table creation, and query/visualization development
github - version control, content repository.
heroku - web deployment, including database hosting.

## Versioning

GitHub is used for version control; the github repository is 
rguthrie000/rguthrieBurgerFoodTruck.

## Author
rguthrie000 (Richard Guthrie)

## Acknowledgments
rguthrie000 is grateful to the UCF Coding Bootcamp - we rock!

