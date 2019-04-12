<<<<<<< HEAD
var db      = require("mysql");
var router  = require("express").Router();

var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap'
});

//------------------------------------------------------------------------------

router.get("/events", function(req, res){
    con.query("SELECT *, org_OrgName, user_Name " +
              "FROM Events, Organizations, Users " +
              "WHERE Events.ev_OrgID = Organizations.org_ID and " +
              "Events.ev_UserID = Users.user_ID", function (err, result, fields) {
        if (err) throw err;
        res.render("events", {events: result});
    });

});

router.get("/event-:ev_ID", function(req, res){
    con.query("SELECT *, org_OrgName, user_Name " +
              "FROM Events, Organizations, Users " +
              "WHERE Events.ev_OrgID = Organizations.org_ID and " +
              "Events.ev_UserID = Users.user_ID and Events.ev_ID = '" + req.params.ev_ID + "'", function (err, result, fields) {
        if (err) throw err;
        res.render("events", {events: result});
    });

});

//------------------------------------------------------------------------------

router.post("/events", function(req, res){
    var sql = "INSERT INTO Events (ev_ID, ev_DateCreated, ev_Name, ev_OrgID, ev_StartDate, ev_EndDate, ev_Notes, ev_UserID) VALUES ?";
    var events = [[
        req.body.ev_ID,
        req.body.ev_DateCreated,
        req.body.ev_Name,
        req.body.ev_OrgID,
        req.body.ev_StartDate,
        req.body.ev_EndDate,
        req.body.ev_Notes,
        req.body.ev_UserID,
    ]];

    if (req.body.ev_EndDate > req.body.ev_StartDate){
        con.query(sql, [events], function(err, result){
            if(err) throw err;
        });
        res.redirect("events");
    }

});

//------------------------------------------------------------------------------

router.post("/events_edit", function(req, res){
    var sql = "UPDATE Events SET ev_Name = ?, ev_OrgID = ?, ev_StartDate = ?, ev_EndDate = ?, ev_Notes = ? WHERE ev_ID = ?";
    var events = [
        req.body.e_ev_Name,
        req.body.e_ev_OrgID,
        req.body.e_ev_StartDate,
        req.body.e_ev_EndDate,
        req.body.e_ev_Notes,
        req.body.e_ev_ID,
    ];
    if (req.body.e_ev_EndDate > req.body.e_ev_StartDate){
        con.query(sql, events, function (err, result) {
            if (err) throw err;
        });
        res.redirect("events");
    } 
 
});

//------------------------------------------------------------------------------

router.post("/events_remove", function(req, res){
    var events = [[
        req.body.ev_ID
    ]];
    var sql = "DELETE FROM Events WHERE ev_ID = ?";
    con.query(sql, [events], function (err, result) {
        if (err) throw err;
    });
    res.redirect("events");
});

//------------------------------------------------------------------------------

=======
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


//------------------------------------------------------------------------------

router.get("/events", function(req, res){
    var status = [
        "Pending",
        "Denied",
        "Approved",
        "In Progress",
        "Cancelled",
        "Complete"
    ];
    con.query("SELECT * " +
              "FROM Events, Organizations, Users " +
              "WHERE Events.ev_OrgID = Organizations.org_ID and " +
              "Events.ev_UserID = Users.user_ID", function (err, result, fields) {
        if (err) throw err;
        res.render("events", {events: result, status: status});
    });
});

//------------------------------------------------------------------------------

router.get("/events/new", function(req, res){
    con.query("SELECT * FROM Organizations", function (err, result, fields) {
        if (err) throw err;
        res.render("events_new", {orgs: result});
    });
});

//------------------------------------------------------------------------------

router.post("/events", function(req, res){
    var sql = "INSERT INTO Events (ev_DateCreated, ev_UserID, ev_QtyiPad, ev_QtyCCR, " + 
    "ev_Name, ev_OrgID, ev_StartDate, ev_EndDate, ev_Notes) VALUES ?";
    var today = new Date();
    var events = [[
        today,
        1,
        req.body.ev_QtyiPad,
        req.body.ev_QtyCCR,
        req.body.ev_Name,
        req.body.ev_OrgID,
        req.body.ev_StartDate,
        req.body.ev_EndDate,
        req.body.ev_Notes
    ]];
    if (req.body.ev_EndDate > req.body.ev_StartDate){
        con.query(sql, [events], function(err, result){
            if(err) throw err;
        });
        res.redirect("/events");
    }
});

//------------------------------------------------------------------------------

router.get("/events/:id/edit", function(req, res){
    var sql = "SELECT Events.*, DATE_FORMAT(ev_StartDate,'%Y-%m-%dT%H:%m') AS DtStart, " +
              "DATE_FORMAT(ev_EndDate,'%Y-%m-%dT%H:%m') AS DtEnd " +
              "From Events WHERE ev_ID = " + req.params.id + "; SELECT * From Organizations";
    var status = [
        "Pending",
        "Denied",
        "Approved",
        "In Progress",
        "Cancelled",
        "Complete"
    ];
    con.query(sql, [1, 2], function(err, result, fields){
        if (err) throw err;
        res.render("events_edit", {event: result[0], orgs: result[1], status: status});
    });
});

//------------------------------------------------------------------------------

router.put("/events/:id", function(req, res){
    var sql = "UPDATE Events SET ev_QtyiPad = ?, ev_QtyCCR = ?, ev_Name = ?, " + 
    "ev_OrgID = ?, ev_StartDate = ?, ev_EndDate = ?, ev_Notes = ?, ev_Status = ? WHERE ev_ID = ?";
    var events = [
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
        if (err) throw err;
    });
    res.redirect("/events");
});

//------------------------------------------------------------------------------


>>>>>>> c279779c0670e8a42b99da4fe6ea7d346263537f
module.exports = router;