// This code block sets up a listener on a button click to fetch events data from the server and display them in eventmodal.
$(document).ready(() => {
  let apiToken = $("#apiToken").text();
  console.log("document ready!");
  console.log(`apiToken: ${apiToken}`);
  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get(`/api/events?apiToken=${apiToken}`, (results = {}) => {
      let data = results.data;
      if (!data || !data.events) return;
      data.events.forEach((event) => {
        const startDate = new Date(event.startDate).toLocaleString();
        const endDate = new Date(event.endDate).toLocaleString();
        const canAttend = event.attendees.indexOf(apiToken) === -1 && event.organizer.apiToken !== apiToken;
        $(".modal-body").append(`
          <div>
            <span class="event-title">${event.title}</span>
            <div class="event-description">${event.description}</div>
            <div class="event-location">${event.location}</div>
            <div class="event-startDate">${startDate}</div>
            <div class="event-endDate">${endDate}</div>
            <button class="join-button" data-id="${event._id}" data-organizer-token="${event.organizer.apiToken}">Attend</button>
          </div>
          <br>
        `);
      });
    }).then(() => {
      addJoinButtonListener(apiToken);
    });
  });
});  
// This function sets up a listener on the join button that has been dynamically created.
let addJoinButtonListener = (token) => {
  $(".join-button").click((event) => {
    if (token == "") {
      alert("You need to log in to attend this event.");
      return;
    }
    let $button = $(event.target),
      eventId = $button.data("id"),
      eventOrganizerToken = $button.data("organizerToken");  // get organizer's apiToken from button's data attributes
    $.get(`/api/events/${eventId}/attend?apiToken=${token}`, (results = {}) => {
      let data = results.data;
      if (data && data.success) {
        $button
          .text("Attended Successfully!")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        let message = (token === eventOrganizerToken) ? "Organizer cannot attend the event" : "You have already attended the event";
        $button.text(message);
      }
    });
  });
};

