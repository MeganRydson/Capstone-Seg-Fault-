var express             = require("express"),
    parse               = require("body-parser"),
    db                  = require("mysql"),
    mailer              = require("nodemailer"),
    redirectToHTTPS     = require("express-http-to-https").redirectToHTTPS,
    app                 = express(),
    session             = require('express-session'),
    flash               = require('connect-flash'),
    session             = require('express-session'),
    auth                = require('./auth.js');
    
var indexRoutes         = require("./routes/index"),
    deviceRoutes        = require("./routes/devices"),
    locationRoutes      = require("./routes/locations"),
    eventsRoutes        = require("./routes/events"),
    organizationRoutes  = require("./routes/organizations");


app.use(parse.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

// Tells app to use password session
app.use(auth.initialize());
app.use(auth.session());
app.use(flash());
app.use(session({ 
        secret: 'some-secret',
        saveUninitialized: false,
        resave: true
}));

//-------------------------------DB CONNECTION----------------------------------
var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ROUTES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//-------------------------------HOME-------------------------------------------
app.get("/", function(req, res){
    // //res.render("home");
    res.redirect("Login");
    // if(req.user) {
    //         res.send(
    //             '<p>You\'re logged in as <strong>' + req.user.username + '</strong>.</p>'
    //             + '<p><a href="/logout">Log out</a></p>'
    //         );
    //     }
    //     else {
    //         res.send('<p><a href="/Login">Devices</a></p>');
    //     }
});


app.get('/login', function(req,res){
    res.render()
});

app.post('/login', 
        auth.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
);
//-------------------------------DEVICES----------------------------------------
//GET AND POST
app.get("/devices", function(req, res){
    con.query("SELECT * FROM Devices", function (err, result, fields) {
        if (err) throw err;
        res.render("devices", {devices: result});
    });
});

app.post("/devices", function(req, res){
    var sql = "INSERT INTO Devices (dev_Name, dev_SN, dev_Description, dev_Active) VALUES ?";
    var devices = [
        [req.body.dev_Name, req.body.dev_SN, req.body.dev_Description, 'true']
    ];
    con.query(sql, [devices], function(err, result){
        if(err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    res.redirect("devices");
});

//REMOVE
app.post("/removeDevices", function(req, res){
    var devices = [
        [req.body.dev_ID]
    ];
    console.log(devices);

    var sql = "DELETE FROM Devices WHERE dev_ID = ?";
    con.query(sql, [devices], function (err, result) {
        if (err) throw err;
           console.log("Number of records deleted: " + result.affectedRows);
    });

    res.redirect("devices");
});


//-------------------------------LOCATIONS--------------------------------------
//GET AND POST
app.get("/locations", function(req, res){
    con.query("SELECT * FROM Locations", function (err, result, fields) {
        if (err) throw err;
        res.render("locations", {locations: result});
    });
});


app.post("/locations", function(req, res){
    var sql = "INSERT INTO Locations (loc_Name) VALUES ?";
    var locations = [
        [req.body.loc_Name]
    ];
    con.query(sql, [locations], function(err, result){
        if(err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    res.redirect("locations");
});


//REMOVE
app.post("/removeLocations", function(req, res){
    console.log("something happened");
    
    var locations = [
        [req.body.loc_ID]
    ];
    console.log(locations);
    
    var sql = "DELETE FROM Locations WHERE loc_ID = ?";
    con.query(sql, [locations], function (err, result) {
        if (err) throw err;
           console.log("Number of records deleted: " + result.affectedRows);
    });
    
    res.redirect("locations");
});

//TO EDIT LOCATION INFO
app.get("/editLocations", function(req, res){
    res.redirect("locations");
});

app.post("/editLocations", function(req, res){
    console.log("something happened");
    
    var locations = [
        [req.body.loc_ID]
    ];
    console.log(locations);
    
    var sql = "UPDATE Locations SET loc_Name WHERE loc_ID = ?";
    con.query(sql, [locations], function (err, result) {
        if (err) throw err;
           console.log("Number of records edited: " + result.affectedRows);
    });
    
    res.redirect("locations");
});


//-------------------------------ORGANIZATIONS----------------------------------
//GET AND POST
app.get("/organizations", function(req, res){
    con.query("SELECT * FROM Organizations", function (err, result, fields) {
        if (err) throw err;
        res.render("organizations", {organizations: result});
    });
});

app.post("/organizations", function(req, res){
    var sql = "INSERT INTO Organizations (org_OrgName, org_BudgetCode) VALUES ?";
    var organizations = [
        [req.body.org_OrgName, req.body.org_BudgetCode]
    ];
    con.query(sql, [organizations], function(err, result){
        if(err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    res.redirect("organizations");
});

//REMOVE
app.post("/removeOrganizations", function(req, res){
    console.log("something happened");
    
    var organizations = [
        [req.body.org_ID]
    ];
    console.log(organizations);
    
    var sql = "DELETE FROM Organizations WHERE org_ID = ?";
    con.query(sql, [organizations], function (err, result) {
        if (err) throw err;
           console.log("Number of records deleted: " + result.affectedRows);
    });
    
    res.redirect("organizations");
});

//---------------------------------ROUTING--------------------------------------
app.use(indexRoutes);
app.use(deviceRoutes);
app.use(locationRoutes);
app.use(eventsRoutes);
app.use(organizationRoutes);



//-------------------------------SERVER INIT------------------------------------
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated (port " + process.env.PORT + ")...");
});