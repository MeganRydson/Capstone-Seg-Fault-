var db      = require("mysql");
var router  = require("express").Router();
var User    = require("./models/user");
var passport = require("passport");


//------------------------------------------------------------------------------

var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap'
});

//-------------------------------Auth Routes----------------------------------
//show sign up form
router.get("/register", function(req, res){
    res.render("register");
});

//handling user sign up
router.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
       if(err){
           console.log(err);
           return res.render('register');
       } 
       passport.authenticate("local")(req, res, function(){
          res.redirect("/");
       });
    });
});


//Log In Routes
router.get("/login", function(req, res){
    res.render("/");
});

//log in login
// router.post("/login", passport.authenticate("local", {
//     // successRedirect: "/",
//     // failureRedirect: "/login"
//     res.redirect("/");
// }) ,function(req, res){
// });




//Sign Out Routes
router.get("/signOut", function(req, res){
    req.logout();
    res.redirect("/login");
});


//-------------------------------Middleware----------------------------------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//isLoggedIn
router.get("/",   function(req, res){
    
    con.query("SELECT *, org_OrgName, user_Name " +
              "FROM Events, Organizations, Users " +
              "WHERE Events.ev_OrgID = Organizations.org_ID and " +
              "Events.ev_UserID = Users.user_ID", function (err, result, fields) {
        if (err) throw err;
        res.render("home", {events: result});
    });
});

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------

module.exports = router;
