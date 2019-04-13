var db      = require("mysql");
var router  = require("express").Router();

var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap'
});

//-------------------------------Middleware----------------------------------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//------------------------------------------------------------------------------
//isLoggedIn
router.get("/organizations",function(req, res){
    con.query("SELECT * FROM Organizations", function (err, result, fields) {
        if (err) throw err;
        res.render("organizations", {organizations: result});
    });
});

//------------------------------------------------------------------------------

router.post("/organizations", function(req, res){
    var sql = "INSERT INTO Organizations (org_OrgName, org_BudgetCode) VALUES ?";
    var organizations = [[
        req.body.org_OrgName,
        req.body.org_BudgetCode
    ]];
    con.query(sql, [organizations], function(err, result){
        if(err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    res.redirect("/organizations");
});

//------------------------------------------------------------------------------

router.post("/organizations_edit", function(req, res){
    var sql = "UPDATE Organizations SET org_OrgName = ?, org_BudgetCode = ? WHERE org_ID = ?";
    var organizations = [
        req.body.e_org_OrgName,
        req.body.e_org_BudgetCode,
        req.body.e_org_ID
    ];
    con.query(sql, organizations, function (err, result) {
        if (err) throw err;
    });
    res.redirect("/organizations");
});

//------------------------------------------------------------------------------

router.post("/organizations_remove", function(req, res){
    var organizations = [[
        req.body.org_ID
    ]];
    var sql = "DELETE FROM Organizations WHERE org_ID = ?";
    con.query(sql, [organizations], function (err, result) {
        if (err) throw err;
    });
    res.redirect("/organizations");
});

//------------------------------------------------------------------------------

module.exports = router;