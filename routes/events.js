var db      = require("mysql");
var router  = require("express").Router();
var mailer  = require("nodemailer");

var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap',
    multipleStatements: true
});

//-------------------------------Middleware----------------------------------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//------------------------------------------------------------------------------

router.get("/events", isLoggedIn, function(req, res){
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
            else {
                let data, trans;
                trans = mailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "segfaultcapstone@gmail.com",
                        pass: "Segfault2019@!"
                    }
                });
                data = {
                    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
                    to: "brian@brians.pics",
                    subject: 'New message from your app',
                    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
                };
                trans.sendMail(data, function(err, response){
                    if(err){
                        res.render("failure");
                    }
                    else{
                        res.render("success");
                    }
                });
            }
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
        console.log(result[0]);
        
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


module.exports = router;