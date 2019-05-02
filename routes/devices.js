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

router.get("/devices", function(req, res){
    con.query("SELECT * FROM Devices;" + 
              "SELECT * FROM Events_Has_Devices WHERE ev_DtReturn is null; " + 
              "SELECT * FROM Events WHERE ev_Status = '4';", function (err, result, fields) {
        if (err) throw err;
        res.render("devices", {devices: result[0], ev_has_dev: result[1], events: result[2]});
    });
});

//------------------------------------------------------------------------------

router.post("/devices", function(req, res){
    var sql = "INSERT INTO Devices (dev_Name, dev_SN, dev_Description) VALUES ?";
    var devices = [[
        req.body.dev_Name,
        req.body.dev_SN,
        req.body.dev_Description 
    ]];
    con.query(sql, [devices], function(err, result){
        if(err) throw err;
    });
    res.redirect("/devices");
});

//------------------------------------------------------------------------------

router.get("/devices/:id/edit", function(req, res){
    con.query("SELECT * FROM Devices WHERE dev_ID = " + req.params.id, function (err, result, fields) {
        if (err) throw err;
        res.render("devices_edit", {devices: result});
    });
});

//------------------------------------------------------------------------------

router.put("/devices/:id", function(req, res){
    var sql = "UPDATE Devices SET dev_Name = ?, dev_SN = ?, dev_Description = ?, dev_Active = ? WHERE dev_ID = ?";
    var devices = [
        req.body.dev_Name,
        req.body.dev_SN,
        req.body.dev_Description,
        req.body.dev_Active,
        req.body.dev_ID
    ];
    con.query(sql, devices, function (err, result) {
        if (err) throw err;
    });
    res.redirect("/devices");
});

//------------------------------------------------------------------------------

router.post("/devices_remove", function(req, res){
    var devices = [[
        req.body.dev_ID
    ]];
    var sql = "DELETE FROM Devices WHERE dev_ID = ?";
    con.query(sql, [devices], function (err, result) {
        if (err){
            console.log("Cannot be deleted!!!");
        }    
    
    });
    res.redirect("/devices");
});

//------------------------------------------------------------------------------

module.exports = router;