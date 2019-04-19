
var db      = require("mysql");
var router  = require("express").Router();


//------------------------------------------------------------------------------

var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap'
});


//------------------------------------------------------------------------------

router.get("/", function(req, res){
    con.query("SELECT *, org_OrgName, user_Name " +
              "FROM Events, Organizations, Users " +
              "WHERE Events.ev_OrgID = Organizations.org_ID and " +
              "Events.ev_UserID = Users.user_ID", function (err, result, fields) {
        if (err) throw err;
        res.render("home", {events: result});
    });
});

//------------------------------------------------------------------------------

module.exports = router;
