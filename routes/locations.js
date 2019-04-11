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

router.get("/locations", function(req, res){
    con.query("SELECT * FROM Locations", function (err, result, fields) {
        if (err) throw err;
        res.render("locations", {locations: result});
    });
});

//------------------------------------------------------------------------------

router.post("/locations", function(req, res){
    var sql = "INSERT INTO Locations (loc_Name) VALUES ?";
    var locations = [[
        req.body.loc_Name
    ]];
    con.query(sql, [locations], function(err, result){
        if(err) throw err;
    });
    res.redirect("/locations");
});

//------------------------------------------------------------------------------

router.post("/locations_edit", function(req, res){
    var sql = "UPDATE Locations SET loc_Name = ? WHERE loc_ID = ?";
    var locations = [
        req.body.e_loc_Name,
        req.body.e_loc_ID
    ];
    con.query(sql, locations, function (err, result) {
        if (err) throw err;
    });
    res.redirect("/locations");
});

//------------------------------------------------------------------------------

router.post("/locations_remove", function(req, res){
    var locations = [[
        req.body.loc_ID
    ]];
    var sql = "DELETE FROM Locations WHERE loc_ID = ?";
    con.query(sql, [locations], function (err, result) {
        if (err) throw err;
    });
    res.redirect("/locations");
});

//------------------------------------------------------------------------------

module.exports = router;