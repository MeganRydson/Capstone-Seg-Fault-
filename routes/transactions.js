var db      = require("mysql");
var router  = require("express").Router();
var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap'
});

var tbl_arry = [];

//-Transactions Grid -----------------------------------------------------------
router.get("/transactions", function(req, res){
    con.query("SELECT Transactions.*, DATE_FORMAT(tr_Date, '%m/%d/%Y %l:%i %p') AS TrDate," +
              "DATE_FORMAT(tr_ImportDate, '%m/%d/%Y %l:%i %p') AS ImpDate," +
              "CONCAT('$ ',FORMAT(tr_Amt, 2)) AS Amount, " +
              "dev_Name, ev_Name FROM Transactions, Devices, Events " +
              "WHERE Transactions.tr_DevID = Devices.dev_ID AND " + 
              "Transactions.tr_EvID = Events.ev_ID ORDER BY tr_Date DESC ", function (err, result, fields) {
        if (err) throw err;
        res.render("transactions", {transactions: result});
    });
});

//-------------------------------------------------------------------------------
router.post("/transactions", function(req, res){
    res.redirect("/transactions");
});

module.exports = router;