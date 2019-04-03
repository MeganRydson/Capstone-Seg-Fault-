$(document).ready(function() {
  $(".ui.checkbox").checkbox();
  $(".modal-pop[data-modal]").click(function() {
    $(".modal[data-modal=" + $(this).attr("data-modal") + "]")
      .modal()
      .modal("show");
  });
   $("#calendar").fullCalendar({
    defaultView: "month",
  // });
//var calendar = new Calendar(document.getElementById("calendar"), {
  events: events.map(function (event) {
    return {
      title: event.ev_Name,
      start: event.ev_StartDate,
      end: event.ev_EndDate,
      allDay : false
    }
  })
});
 });