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

router.get("/settlements", function(req, res){
    con.query("SELECT * FROM Settlements", function (err, result, fields) {
        if (err) throw err;
        res.render("settlements", {settlements: result});
    });
});

//------------------------------------------------------------------------------

router.post("/settlements", function(req, res){
    var sql = "INSERT INTO Settlements () VALUES ?";
    
    con.query(sql, [settlements], function(err, result){
        if(err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    res.redirect("settlements");
});

//------------------------------------------------------------------------------

router.post("/settlements_edit", function(req, res){
    var sql = "UPDATE Settlements SET org_OrgName = ?, org_BudgetCode = ? WHERE org_ID = ?";
    var settlements = [
        req.body.e_org_OrgName,
        req.body.e_org_BudgetCode,
        req.body.e_org_ID
    ];
    con.query(sql, settlements, function (err, result) {
        if (err) throw err;
    });
    res.redirect("settlements");
});

//------------------------------------------------------------------------------

router.post("/settlements_remove", function(req, res){
    var settlements = [[
        req.body.org_ID
    ]];
    var sql = "DELETE FROM Settlements WHERE org_ID = ?";
    con.query(sql, [settlements], function (err, result) {
        if (err) throw err;
    });
    res.redirect("settlements");
});

//------------------------------------------------------------------------------

module.exports = router;