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
    res.render("home");
});

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

//Server initiation
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated (port " + process.env.PORT + ")...");
});