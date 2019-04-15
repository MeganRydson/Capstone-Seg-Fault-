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
//isLoggedIn,
router.get("/users",  function(req, res){
    con.query("SELECT * FROM Users", function (err, result, fields) {
        if (err) throw err;
        res.render("users", {users: result});
    });
});

//------------------------------------------------------------------------------

router.post("/users", function(req, res){
    var sql = "INSERT INTO Users (user_Name, user_Email, user_Phone, user_Type) VALUES ?";
    var users = [[
        req.body.user_Name,
        req.body.user_Email,
        req.body.user_Phone,
        req.body.user_Type
    ]];
    con.query(sql, [users], function(err, result){
        if(err) throw err;
    });
    res.redirect("/users");
});

//------------------------------------------------------------------------------

router.post("/users_edit", function(req, res){
    var sql = "UPDATE Users SET user_Name = ?, user_Email = ?, user_Phone = ?, user_Type = ? WHERE user_ID = ?";
    var users = [
        req.body.e_user_Name,
        req.body.e_user_Email,
        req.body.e_user_Phone,
        req.body.e_user_Type,
        req.body.e_user_ID
    ];
    con.query(sql, users, function (err, result) {
        if (err) throw err;
    });
    res.redirect("/users");
});

//------------------------------------------------------------------------------

router.post("/users_remove", function(req, res){
    var users = [[
        req.body.user_ID
    ]];
    var sql = "DELETE FROM Users WHERE user_ID = ?";
    con.query(sql, [users], function (err, result) {
        if (err) throw err;
    });
    res.redirect("/users");
});

//------------------------------------------------------------------------------

module.exports = router;