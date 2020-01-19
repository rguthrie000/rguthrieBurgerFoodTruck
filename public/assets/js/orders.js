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
  // format, which will allow direct subtraction of creation time from
  // current time.
  //
  // Uh oh, heroku's database presents the same time in a different way.  Looks
  // like we're going to have to deal with timezones!
  //                     0   1   2  3    4        5        6        7        8    
  // JS:                "Sat Jan 18 2020 11:18:54 GMT-0500 (Eastern Standard Time)"
  // mySQL, localhost:  "Sun Jan 19 2020 07:18:54 GMT-0500 (Eastern Standard Time)"
  // mySQL, JAWS_db:    "Sun Jan 19 2020 12:18:54 GMT-0000 (Coordinated Universal Time)"
  
  let thenStr = mysqlTime;

  // Mock-ups for testing TZ correction
  // thenStr = "Sun Jan 19 2020 07:18:54 GMT-0500 (Eastern Standard Time)";
  // thenStr = "Sun Jan 19 2020 12:18:54 GMT-0000 (Coordinated Universal Time)";
  // thenStr = "Sun Jan 19 2020 13:18:54 GMT+0100 (Central European Time)";

  // separate the mySQL string into word strings
  let thenArr = thenStr.split(' ');

  // then break up the hour, minute, and second
  let hhmmss = thenArr[4].split(':');
 
  // convert the mySQL time to a JS date object using the Date class constructor.  Note than months are numbered 0-11.
  // JS input format for converting to the date and time shown above for JS: 'new Date(2020, 0, 18, 11, 18, 54, 0);
  let timeThen = new Date(thenArr[3], month(thenArr[1]), thenArr[2], hhmmss[0], hhmmss[1], hhmmss[2], 0);

  // convert to the number of milliseconds since the start of 1970-01-01
  let t1 = timeThen.getTime();  

  // t1 must be adjusted for UTC.  We need the last part of thenArr[5]...
  let wLen = thenArr[5].length;
  let UTCoffsetSign = thenArr[5].slice(wLen-5,wLen-4);
  let UTCoffsetHr   = thenArr[5].slice(wLen-4,wLen-2);
  let UTCoffsetMin  = thenArr[5].slice(wLen-2);
  
  // console.log(`UTCoffset: thenArr[5] ${thenArr[5]} (length ${wLen}) sign ${UTCoffsetSign} hr ${UTCoffsetHr} min ${UTCoffsetMin}`)
  
  //                  (          hrs       +          fraction of hr)   * min/hr * sec/min * ms/sec
  let UTCoffset     = (Number(UTCoffsetHr) + (Number(UTCoffsetMin)/60)) *   60   *   60    * 1000;

  // if sign is '-', t1 reads behind UTC, so add the offset; if sign is '+', t1 reads ahead, so 
  // subtract, or in other words, 'add the inverse'.
  UTCoffset = (UTCoffsetSign == '-') ? UTCoffset :-UTCoffset;

  t1 = Number(t1) + UTCoffset;
  
  // get the time now (ms since 197001010000 UTC)
  let t = new Date();                    // local time in ms
  let tzOffset = t.getTimezoneOffset();  // adjustment to get to UTC, in minutes
  t2 = Date.now() + (Number(tzOffset) * 60 * 1000);

  // find the time difference in seconds
  let tDiffSec = 0.001*(Number(t2)-t1);

  // console.log(`Local tz offset: ${tzOffset}. For: ${thenStr}, UTCoffset is ${UTCoffset}, and age is ${tDiffSec}`);

  return(tDiffSec);
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