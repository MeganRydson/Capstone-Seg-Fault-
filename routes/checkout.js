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

var sql = "SELECT * FROM Events WHERE ev_Status = '2' or ev_Status = '4'; " + 
          "SELECT * FROM Devices WHERE dev_Active = '1' and dev_Type < '3' and dev_Returned = '1'; " +
          "SELECT *, Devices.dev_Name, Devices.dev_Description FROM Events_Has_Devices, Devices " +
          "WHERE Events_Has_Devices.dev_ID = Devices.dev_ID;";

var sql_add_ret = "SELECT * FROM Events WHERE ev_ID = ?; " + 
                  "SELECT * FROM Devices WHERE dev_Active = '1' and dev_Type < '3' and dev_Returned = '1'; " +
                  "SELECT *, Devices.dev_Name, Devices.dev_Description FROM Events_Has_Devices, Devices " +
                  "WHERE Events_Has_Devices.ev_ID = ? and Events_Has_Devices.dev_ID = Devices.dev_ID";


var sql_add = "INSERT INTO Events_Has_Devices (dev_ID, ev_ID, ev_DtCheckOut, ev_DtBegin, ev_DtEnds) VALUES ?";

var sql_dev_update = "UPDATE Devices SET dev_Returned = '0' WHERE dev_ID = ?";

var sql_return = "UPDATE Events_Has_Devices SET ev_DtReturn = ? WHERE evdev_ID = ?";

var sql_dev_return = "UPDATE Devices SET dev_Returned = '1' WHERE dev_ID = ?";

var sql_events_update = "UPDATE Events SET ev_Status = '4' WHERE ev_ID = ?";


var eventID = 0;

//------------------------------------------------------------------------------

router.get("/checkout", function(req, res){

    if (eventID == 0){
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.render("checkout", {events: result[0], devices: result[1], ev_has_dev: result[2]});
        });
    }else{
        con.query(sql_add_ret,[eventID, eventID], function (err, result, fields) {
            if (err) throw err;
            res.render("checkout", {events: result[0], devices: result[1], ev_has_dev: result[2]});
        });
    }

});



//------------------------------------------------------------------------------
router.post("/checkout", function(req, res){

    if (req.body.select){
        eventID = req.body.ev_ID;
    }else if (req.body.done){
        eventID = 0;
    }

    res.redirect("/checkout");

});


//-------------------------------------------------------------------------------

router.post("/checkout_add", function(req, res){

    var today = new Date();
    var checkout = [[
        req.body.a_dev_ID,
        eventID,
        today,
        req.body.a_ev_StartDate,
        req.body.a_ev_EndDate
    ]];


    con.query(sql_add, [checkout], function(err, result){
            if(err) throw err;
    });
    var dev_ID = req.body.a_dev_ID;
    con.query(sql_dev_update, [dev_ID], function(err, result){
        if(err) throw err;
    });

    con.query(sql_events_update, [eventID], function(err, result){
        if(err) throw err;
    });


    res.redirect("/checkout");

});

//------------------------------------------------------------------

router.post("/checkout_return", function(req, res){

    var today = new Date();
    var checkout = [
        today,
        req.body.r_evdev_ID
    ];


    con.query(sql_return, checkout, function(err, result){
            if(err) throw err;
    });
    var dev_ID = req.body.r_dev_ID;
    con.query(sql_dev_return, dev_ID, function(err, result){
        if(err) throw err;
    });

    res.redirect("/checkout");

});



module.exports = router;