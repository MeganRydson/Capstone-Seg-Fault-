<<<<<<< HEAD
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

//Node.js app requirements. These lines only work if you've already installed them.
var express             = require("express"),
    parse               = require("body-parser"),
    db                  = require("mysql"),
    mailer              = require("nodemailer"),
    redirectToHTTPS     = require("express-http-to-https").redirectToHTTPS,
    app                 = express();

//This just makes it so that we don't have to type out '.ejs' after every webpage route
//note: .ejs files stand for embedded javascript
app.set("view engine", "ejs");

//This is for images, scripts, and stylesheets in the public directory so we don't
//have to type the public directory when calling js and css files in our htlm headers
app.use(express.static(__dirname + "/public/"));

//This allows us to extract post request data and use it server-side
app.use(parse.urlencoded({extended: true}));

//HTTP is default route (we don't want this). This redirects all routes to HTTPS for security
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

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

app.get("/", function(req, res){
    var devices = [
        {dev_ID: 001, dev_Name: "Dev1", dev_SN: "12345", dev_Description: "The first device", dev_Available: true},
        {dev_ID: 002, dev_Name: "Dev2", dev_SN: "23456", dev_Description: "I'm second!", dev_Available: false},
        {dev_ID: 003, dev_Name: "Dev3", dev_SN: "34537", dev_Description: "Last but not least", dev_Available: true}
    ]
    res.render("home", {devices: devices});
});


//DEVICES GET AND POST
app.get("/devices", function(req, res){
    con.query("SELECT * FROM Devices", function (err, result, fields) {
        if (err) throw err;
        res.render("devices", {devices: result});
    });
});

app.get("/organizations", function(req, res){
    con.query("SELECT * FROM Organizations", function (err, result, fields) {
        if (err) throw err;
        res.render("organizations", {organizations: result});
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

//ORGANIZATIONS GET AND POST
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
//TO REMOVE ORGANIZATIONS FROM DB
app.get("/removeOrganizations", function(req, res){
    res.redirect("organizations");
});

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

//------------------------------------------------------------

//LOCATIONS GET AND POST
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
//----------------------------------------------------------------

//TO REMOVE LOCATIONS FROM DB
app.get("/removeLocations", function(req, res){
    res.redirect("locations");
});

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


//Server initiation
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});



=======
var express             = require("express"),
    parse               =  require("body-parser"),
    db                  = require("mysql"),
    mailer              = require("nodemailer"),
    redirectToHTTPS     = require("express-http-to-https").redirectToHTTPS,
    app                 = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(parse.urlencoded({extended: true}));
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));


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
    res.render("home");
});


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


//-------------------------------SERVER INIT------------------------------------
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated (port " + process.env.PORT + ")...");
});
>>>>>>> 321628b1e450d5142b1fc18f6250256d201feb02
