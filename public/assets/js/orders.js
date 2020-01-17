// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {

  let debug = true;

  $(".change-served").on("click", function(event) {
    let id = $(this).data("id");
    let newServed = $(this).data("newserved");
    newServed ^= 1;
    let newServedState = {
      served: newServed
    };

    // Send the PUT request.
    $.ajax(`/api/orders/${id}`, {type: "PUT", data: newServedState})
    .then( () => {
        if (debug) console.log("changed served to", newServed);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  $(".create-form").on("submit", (event) => {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    let newOrder = {
      menuItem: $("#ca").val().trim(),
      served: $("[name=served]:checked").val().trim()
    };

    if (debug) console.log(`submitting order; menuItem ${newOrder.menuItem}, served ${newOrder.served}`);

    // Send the POST request.
    $.ajax("/api/orders", {type: "POST", data: newOrder})
    .then( () => {
        if (debug) console.log(`ordered ${newOrder.menuItem}`);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

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

// function reloadTimer() {
//   console.log('1 Hz reload')
//   location.reload()
// }
// let timer = setInterval(reloadTimer,1000);
