$(document).ready(function() {
    $(".ui.checkbox").checkbox();
    $('.remove-button[data-modal]').click(function() {
        $('.modal[data-modal=' + $(this).attr('data-modal') + ']').modal().modal('show');
    });
    $('#batch-delete').click(function() {
        $('.modal').modal('show');
    });
    if (typeof events === "object") {
    $("#calendar").fullCalendar({
      defaultView: "month",
      events: events.map(function (event) {
        return {
          title: event.ev_Name,
          start: event.ev_StartDate,
          end: event.ev_EndDate,
          allDay : false,
          url: "/event-" + event.ev_ID
        }
      }),
    });
  };
 });
