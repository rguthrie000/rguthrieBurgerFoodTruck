// Client-side JS to service the buttons and order timers.

// Wait for DOM load.
$(function() {

  $(".change-served").on("click", function(event) {
    let id = $(this).data("id");
    let newServed = $(this).data("newserved");
    // toggle served status 
    newServed ^= 1;
    let newServedState = {
      served: newServed
    };

    // And PUT to the server for database update.
    $.ajax(`/api/orders/${id}`, {type: "PUT", data: newServedState})
    .then( () => {
        if (debug) console.log("changed served to", newServed);
        // Reload the page to get the updated list.
        // Note that the timers run on the difference between
        // present time and creation time -- so state information
        // between the client and server is not changing with time.
        // the application is RESTful.
        location.reload();
      }
    );
  });

  $(".create-form").on("submit", (event) => {
    // Only you can prevent event bubbling!
    event.preventDefault();

    // read form data
    let newOrder = {
      menuItem: $("#ca").val().trim(),
      served: $("[name=served]:checked").val().trim()
    };

    // Send the POST request.
    $.ajax("/api/orders", {type: "POST", data: newOrder})
    .then( () => {
        if (debug) console.log(`ordered ${newOrder.menuItem}`);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  // Handle DELETE similarly.
  $(".delete-order").on("click", function(event) {
    let id = $(this).data("id");

    // Send the DELETE request.
    $.ajax(`/api/orders/${id}`, {type: "DELETE"})
    .then( () => {
        if (debug) console.log("deleted order", id);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
});

// Data is delivered here (to the client) by embedding database
// information in HTML data-* attributes.  So on every page 
// reload, the data is refreshed. To track time for orders,
// their creation time is sent, and this function is used to
// measure elapsed time from creation time to run time.
//
function timeDiff(mysqlTime) {
  
    function month(monthName) {
      switch (monthName.toLowerCase())
      {
        case "jan": return( 0);
        case "feb": return( 1);
        case "mar": return( 2);
        case "apr": return( 3);
        case "may": return( 4);
        case "jun": return( 5);
        case "jul": return( 6);
        case "aug": return( 7);
        case "sep": return( 8);
        case "oct": return( 9);
        case "nov": return(10);
        case "dec": return(11);
      }
    }

  // Data formats for mySQL and JS are the same, so minimal work is
  // required to convert the creation time to the milliseconds-from-19700101 
  // format which will allow direct subtraction of creation time from
  // current time.
  //
  // mySQL: "sat jan 18 2020 10:59:38 gmt-0500 (eastern standard time)"
  // JS:    "Sat Jan 18 2020 11:18:54 GMT-0500 (Eastern Standard Time)"

  // separate the mySQL string into word strings
  let thenArr = mysqlTime.split(' ');
  // then break up the hour, minute, and second
  let hhmmss = thenArr[4].split(':');
 
  // convert the mySQL time to a JS date object using the Date class constructor.  Note than months are numbered 0-11.
  // JS input format for converting to the date and time shown above for JS: 'new Date(2020, 0, 18, 11, 18, 54, 0);
  let timeThen = new Date(thenArr[3], month(thenArr[1]), thenArr[2], hhmmss[0], hhmmss[1], hhmmss[2], 0);
  // convert to the number of milliseconds since the start of 1970-01-01
  let t1 = timeThen.getTime();  
  // get and convert to ms the time now
  let timeNow = new Date();
  let t2 = timeNow.getTime();
  // return the time difference in seconds
  return(0.001*(Number(t2)-Number(t1)));
}

function clockTick() {
  // for each active order on the page
  $("i.t").each(function(i,elt) {
    let timeStr = $(this).data("createdat");
    // fetch the time
    let timeThen = timeStr;
    let ageSeconds = timeDiff(timeThen);
    // assign the timer background color based on order age
    if (ageSeconds > 600) {
      $(this).toggleClass("yellow",false);
      $(this).toggleClass("red"   ,true);
    } else {
      if (ageSeconds > 300) {
        $(this).toggleClass("yellow",true);
      }
    }
    // format to minutes:seconds
    let dtMin = Math.floor(ageSeconds / 60);
    let dtSec = Math.floor(ageSeconds % 60);
    let outStr = `${(dtMin < 10? '0':'')+dtMin}:${(dtSec < 10? '0':'')+dtSec}`;
    // and post to the order card
    $(this).text(outStr);
  }) 
}

main(); function main() {
  setInterval(clockTick,1000);
}