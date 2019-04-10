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

module.exports = router;