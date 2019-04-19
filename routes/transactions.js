var db      = require("mysql");
var router  = require("express").Router();

var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap'
});

// global variables

var filter = 0;
var eventID = 0;

//----------------------

// SQL Queries to be used in /transactions

var sql = "SELECT Transactions.*, DATE_FORMAT(tr_Date, '%m/%d/%Y %l:%i %p') AS TrDate," +
            "DATE_FORMAT(tr_ImportDate, '%m/%d/%Y %l:%i %p') AS ImpDate," +
            "CONCAT('$ ',FORMAT(tr_Amt, 2)) AS Amount, " +
            "dev_Name, ev_Name, DATE_FORMAT(ev_StartDate, '%m/%d/%Y %l:%i %p') AS evDate FROM Transactions, Devices, Events " +
            "WHERE Transactions.tr_DevID = Devices.dev_ID AND " + 
            "Transactions.tr_EvID = Events.ev_ID ORDER BY tr_Date DESC";

var sql_Filter = "SELECT Transactions.*, DATE_FORMAT(tr_Date, '%m/%d/%Y %l:%i %p') AS TrDate," +
                    "DATE_FORMAT(tr_ImportDate, '%m/%d/%Y %l:%i %p') AS ImpDate," +
                    "CONCAT('$ ',FORMAT(tr_Amt, 2)) AS Amount, " +
                    "dev_Name, ev_Name, DATE_FORMAT(ev_StartDate, '%m/%d/%Y %l:%i %p') AS evDate FROM Transactions, Devices, Events " +
                    "WHERE Transactions.tr_DevID = Devices.dev_ID AND " + 
                    "Transactions.tr_EvID = Events.ev_ID AND tr_EvID = ? ORDER BY tr_Date DESC";


//-Transactions Grid -----------------------------------------------------------
router.get("/transactions", function(req, res){

    if (filter == 0){
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }else{
                if (result.length > 0){
                    res.render("transactions", {transactions: result});
                }else{
                    res.redirect("/trans_upload");
                }
            }    
        });
    }else{
        con.query(sql_Filter, [eventID], function (err, result, fields) {
            if (err) {
                throw err;
            }else{
                if (result.length > 0){
                    res.render("transactions", {transactions: result});
                }else{
                    res.redirect("/trans_upload");
                }
            }    
        });
    }
    
});

//-------------------------------------------------------------------------------
router.post("/transactions", function(req, res){
 
    eventID = req.body.tr_EventID;

    if (req.body.delete){
        delete_transactions();
        filter = 0;
    }else if (req.body.filter){
        filter = 1;
    }else if (req.body.clear){
        filter = 0;
    }
    res.redirect("/transactions");
});

//-------------------------------------------------------------------------------

router.post("/transactions_edit", function(req, res){
 
    var sql = "UPDATE Transactions SET tr_Amt = ? WHERE tr_ID = ?";
    var trans = [
        req.body.e_tr_Amt,
        req.body.e_tr_ID
    ];
    con.query(sql, trans, function (err, result) {
        if (err) throw err;
    });
    res.redirect("/transactions");
});

router.post("/transactions_remove", function(req, res){
    var locations = [[
        req.body.tr_ID
    ]];
    var sql = "DELETE FROM Transactions WHERE tr_ID = ?";
    con.query(sql, [locations], function (err, result) {
        if (err) throw err;
    });
    res.redirect("/transactions");
});

router.post("/settlement_new", function(req, res){
    con.query("SELECT *, dev_Name FROM Events_Has_Devices, Devices", function (err, result, fields) {
        if (err) throw err;
        res.render("settlement_new", {eventsDev: result});
    });
});


function delete_transactions(){
    var sql_delete = "DELETE FROM Transactions WHERE tr_EvID = ?";
    con.query(sql_delete, [eventID], function (err, result) {
        if (err) throw err;
    });

    var sql_update = "UPDATE Events SET ev_Status = 4 WHERE ev_ID = ?";
    con.query(sql_update, [eventID], function (err, result) {
        if (err) throw err;
    });
}



module.exports = router;