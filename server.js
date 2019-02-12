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
    var devices = [
        {dev_ID: 001, dev_Name: "Dev1", dev_SN: "12345", dev_Description: "The first device", dev_Available: true},
        {dev_ID: 002, dev_Name: "Dev2", dev_SN: "23456", dev_Description: "I'm second!", dev_Available: false},
        {dev_ID: 003, dev_Name: "Dev3", dev_SN: "34537", dev_Description: "Last but not least", dev_Available: true}
    ]
    res.render("home", {devices: devices});
});

app.post("/add_dev", function(req, res){
    console.log(req.body);
});

//Server initiation
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated (port " + process.env.PORT + ")...");
});