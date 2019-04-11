var express             = require("express"),
    parse               = require("body-parser"),
    db                  = require("mysql"),
    mailer              = require("nodemailer"),
    redirectToHTTPS     = require("express-http-to-https").redirectToHTTPS,
    methodOverride      = require("method-override"),
    path                = require("path"),
    app                 = express();

var indexRoutes         = require("./routes/index"),
    deviceRoutes        = require("./routes/devices"),
    locationRoutes      = require("./routes/locations"),
    organizationRoutes  = require("./routes/organizations"),
    userRoutes          = require("./routes/users"),
    eventRoutes         = require("./routes/events"),
    transactionsRoutes  = require("./routes/transactions"),
    trans_uploadRoutes  = require("./routes/trans_upload");


app.use(parse.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
app.use(methodOverride("_method"));


//-------------------------------DB CONNECTION----------------------------------
var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap',
    multipleStatements: true
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});


//---------------------------------ROUTING--------------------------------------
app.use(indexRoutes);
app.use(deviceRoutes);
app.use(locationRoutes);
app.use(eventRoutes);
app.use(organizationRoutes);
app.use(userRoutes);
app.use(transactionsRoutes);
app.use(trans_uploadRoutes);


//-------------------------------SERVER INIT------------------------------------
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated (port " + process.env.PORT + ")...");
});