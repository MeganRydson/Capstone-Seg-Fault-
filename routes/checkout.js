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

router.get("/checkout", function(req, res){
    con.query("SELECT * FROM Events", function (err, result, fields) {
        if (err) throw err;
        res.render("checkout", {events: result});
    });
});

//------------------------------------------------------------------------------

module.exports = router;