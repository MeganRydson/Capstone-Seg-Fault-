$(document).ready(function() {
  $(".ui.checkbox").checkbox();
  $(".modal-pop[data-modal]").click(function() {
    $(".modal[data-modal=" + $(this).attr("data-modal") + "]")
      .modal()
      .modal("show");
  });
  $("#calendar").fullCalendar({
    defaultView: "month",
  });
 });