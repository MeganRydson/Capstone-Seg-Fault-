//Node.js app requirements. These lines only work if you've already installed them.
var express             = require("express"),
    parse               = require("body-parser"),
    db                  = require("mysql"),
    mailer              = require("nodemailer"),
    redirectToHTTPS     = require("express-http-to-https").redirectToHTTPS,
    app                 = express();
    
let mysql = require('mysql');

//Connection to database
let connection = mysql.createConnection({
    host: 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'Segfaultcapstone',
    password: 'S3gfault2019',
    database: 'db-segfault-cap',
    debug: true
});

//Test and print out whether or not it worked
connection.connect(function(err){
    if(err){
        console.error("Database connection failed -- " + err.stack);
        return;
    }
    console.log("Connected to datbase!!");
});

//This just makes it so that we don't have to type out '.ejs' after every webpage route
//note: .ejs files stand for express js
app.set("view engine", "ejs");

//This is for images, scripts, and stylesheets in the public directory so we don't
//have to type the public directory when calling js and css files in our htlm headers
app.use(express.static(__dirname + "/public/"));

//Can't remember what this does but it's 100% necessary
app.use(parse.urlencoded({extended: true}));

//HTTP is default route (we don't want this). This redirects all routes to HTTPS for security
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "yourusername",
//   password: "yourpassword"
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

app.get("/", function(req, res){
    res.render("home");
});

//Server initiation
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated (port " + process.env.PORT + ")...");
});