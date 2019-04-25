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
  //   document.addEventListener('DOMContentLoaded', function() {
  //   var calendarEl = document.getElementById('calendar');
  
  //   var calendar = new FullCalendar.Calendar(calendarEl, {
  //     plugins: [ 'interaction', 'dayGrid', 'timeGrid' ],
  //     timeZone: 'UTC',
  //     defaultView: 'dayGridMonth',
  //     header: {
  //       left: 'prev,next today',
  //       center: 'title',
  //       right: 'dayGridMonth,timeGridWeek,timeGridDay'
  //     },
  //     editable: true,
  
  //     // JSON FEED INSTRUCTIONS
  //     //
  //     // 1. Open a new browser tab. Go to codepen.io
  //     //
  //     // 2. Create a new pen (Create > New Pen)
  //     //
  //     // 3. Paste your JSON into the JS pane
  //     //
  //     // 4. Hit the "Save" button
  //     //
  //     // 5. The page's URL will change. It will look like this:
  //     //    https://codepen.io/anon/pen/eWPBOx
  //     //
  //     // 6. Append ".js" to it. Will become like this:
  //     //    https://codepen.io/anon/pen/eWPBOx.js
  //     //
  //     // 7. Paste this URL below.
  //     //
  //     events: events.map(function (event) {
  //       return {
  //         title: event.ev_Name,
  //         start: event.ev_StartDate,
  //         end: event.ev_EndDate,
  //         allDay : false,
  //         url: "/event-" + event.ev_ID
  //       }
  //     })
  
  //     // 8. Then, enter a date for defaultDate that best displays your events.
  //     //
  //     // defaultDate: 'XXXX-XX-XX'
  //   });
  
  //   calendar.render();
  // });
 });