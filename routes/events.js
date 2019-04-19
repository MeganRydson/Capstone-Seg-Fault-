var db      = require("mysql");
var router  = require("express").Router();

var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap',
    multipleStatements: true
});

var eventStatus = -2;
var filter = 0;

var sql_std = "SELECT * FROM Events, Organizations, Users " +
                "WHERE Events.ev_OrgID = Organizations.org_ID and " +
                "Events.ev_UserID = Users.user_ID";

var sql_filterStatus = "SELECT * FROM Events, Organizations, Users " +
                "WHERE Events.ev_OrgID = Organizations.org_ID and " +
                "Events.ev_UserID = Users.user_ID and Events.ev_Status = ?";

var sql_filterDtRange_Status = "SELECT * FROM Events, Organizations, Users " +
                "WHERE Events.ev_OrgID = Organizations.org_ID and " +
                "Events.ev_UserID = Users.user_ID and Events.ev_Status = ? " +
                "and ev_StartDate >= ? and ev_EndDate <= ?";

var sql_filterDtRange = "SELECT * FROM Events, Organizations, Users " +
                "WHERE Events.ev_OrgID = Organizations.org_ID and " +
                "Events.ev_UserID = Users.user_ID " +
                "and ev_StartDate >= ? and ev_EndDate <= ?";

var startDate = "";
var endDate = "";


//------------------------------------------------------------------------------

router.get("/events", function(req, res){
    var status = [
        "Pending",
        "Denied",
        "Approved",
        "Cancelled",
        "In Progress",
        "Complete"
    ];
    if (filter == 0){
        con.query(sql_std, function (err, result, fields) {
            if (err) throw err;
            res.render("events", {events: result, status: status});
        });
    }else if (filter == 1){
        con.query(sql_filterStatus, [eventStatus],  function (err, result, fields) {
            if (err) throw err;
            res.render("events", {events: result, status: status});
        });
    }else if (filter == 2){
        var data = [
            eventStatus,
            startDate,
            endDate
        ];
        con.query(sql_filterDtRange_Status, data, function (err, result, fields) {
            if (err) throw err;
            res.render("events", {events: result, status: status});
        });
    }else if (filter == 3){
        var data = [
            startDate,
            endDate
        ];
        con.query(sql_filterDtRange, data, function (err, result, fields) {
            if (err) throw err;
            res.render("events", {events: result, status: status});
        });
    }

});

//------------------------------------------------------------------------------

router.get("/events/new", function(req, res){
    con.query("SELECT * FROM Organizations; SELECT * FROM Users; SELECT * FROM Locations",[1, 2, 3], function (err, result, fields) {
        if (err) throw err;
        res.render("events_new", {orgs: result[0], users: result[1], locs: result[2]});
    });
});

//------------------------------------------------------------------------------

router.post("/events", function(req, res){
    var sql = "INSERT INTO Events (ev_DateCreated, ev_UserID, ev_QtyiPad, ev_QtyCCR, " + 
              "ev_Name, ev_OrgID, ev_StartDate, ev_EndDate, ev_Notes, ev_LocID, ev_EmsID, ev_Status) VALUES ?";
    var today = new Date();
    var events = [[
        today,
        req.body.ev_UserID,
        req.body.ev_QtyiPad,
        req.body.ev_QtyCCR,
        req.body.ev_Name,
        req.body.ev_OrgID,
        req.body.ev_StartDate,
        req.body.ev_EndDate,
        req.body.ev_Notes,
        req.body.ev_LocID,
        req.body.ev_EmsID,
        2
    ]];
    if (req.body.ev_EndDate > req.body.ev_StartDate){
        con.query(sql, [events], function(err, result){
            if(err) throw err;
        });
        filter = 0;
        res.redirect("/events");
    }

    //--Block to filter Events

    eventStatus = req.body.filter_Status;
    startDate = req.body.filter_StartDate;
    endDate = req.body.filter_EndDate;

    if (req.body.filter){
        if (eventStatus == -2 && (req.body.filter_EndDate == "" || req.body.filter_StartDate == "")){
            filter = 0;
        }else if (eventStatus > -2 && (req.body.filter_EndDate == "" || req.body.filter_StartDate == "")){
            filter = 1;
        }else if (eventStatus > -2 && (req.body.filter_EndDate > req.body.filter_StartDate)){
            filter = 2;
        }else if (eventStatus == -2 && (req.body.filter_EndDate > req.body.filter_StartDate)){
            filter = 3;
        }
    }else if (req.body.clear){
        filter = 0;
    }

    res.redirect("/events");
    
    //------------------------
    
});

//------------------------------------------------------------------------------

router.get("/events/:id/edit", function(req, res){
    var sql = "SELECT Events.*, DATE_FORMAT(ev_StartDate,'%Y-%m-%dT%H:%m') AS DtStart, " +
              "DATE_FORMAT(ev_EndDate,'%Y-%m-%dT%H:%m') AS DtEnd " +
              "From Events WHERE ev_ID = " + req.params.id + "; SELECT * From Organizations; " +
              "SELECT * From Users; SELECT * From Locations";
    var status = [
        "Pending",
        "Denied",
        "Approved",
        "Cancelled"
    ];

    con.query(sql, [1, 2, 3, 4], function(err, result, fields){
        if (err) throw err;
        res.render("events_edit", {event: result[0], orgs: result[1], users: result[2], locs: result[3], status: status});
    });
});

//------------------------------------------------------------------------------

router.put("/events/:id", function(req, res){
    var sql = "UPDATE Events SET ev_UserID = ?, ev_LocID = ?, ev_EmsID = ?, ev_QtyiPad = ?, ev_QtyCCR = ?, ev_Name = ?, " + 
    "ev_OrgID = ?, ev_StartDate = ?, ev_EndDate = ?, ev_Notes = ?, ev_Status = ? WHERE ev_ID = ?";
    var events = [
        req.body.ev_UserID,
        req.body.ev_LocID,
        req.body.ev_EmsID,
        req.body.ev_QtyiPad,
        req.body.ev_QtyCCR,
        req.body.ev_Name,
        req.body.ev_OrgID,
        req.body.ev_StartDate,
        req.body.ev_EndDate,
        req.body.ev_Notes,
        req.body.ev_Status,
        req.params.id
    ];
    if (req.body.ev_EndDate > req.body.ev_StartDate){
        con.query(sql, events, function (err, result) {
            if (err) throw err;
        });
        res.redirect("/events");
    }
});

//------------------------------------------------------------------------------

router.post("/events_remove", function(req, res){
    var events = [[
        req.body.ev_ID
    ]];
    var sql = "DELETE FROM Events WHERE ev_ID = ?";
    con.query(sql, [events], function (err, result) {
        if (err) {
            console.log("Cannot Delete!!!");
        };
    });
    res.redirect("/events");
});

//------------------------------------------------------------------------------

router.get("/event-:ev_ID", function(req, res){
    var status = [
        "Pending",
        "Denied",
        "Approved",
        "Cancelled",
        "In Progress",
        "Complete"
    ];
   con.query("SELECT *, org_OrgName, user_Name " +
             "FROM Events, Organizations, Users " +
             "WHERE Events.ev_OrgID = Organizations.org_ID and " +
             "Events.ev_UserID = Users.user_ID and Events.ev_ID = " + req.params.ev_ID, function (err, result, fields) {
       if (err) throw err;
       res.render("events", {events: result, status: status});
   });
});

//------------------------------------------------------------------------------

module.exports = router;