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
//DEVICES GET AND POST
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


//-------------------------------LOCATIONS--------------------------------------
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

//TO REMOVE LOCATIONS FROM DB

app.get("/removeLocations", function(req, res){
    res.render("locations");
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


//-------------------------------SERVER INIT------------------------------------
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated (port " + process.env.PORT + ")...");
});