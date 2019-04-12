var express                 = require("express"),
    parse                   = require("body-parser"),
    db                      = require("mysql"),
    mailer                  = require("nodemailer"),
    redirectToHTTPS         = require("express-http-to-https").redirectToHTTPS,
    methodOverride          = require("method-override"),
    path                    = require("path"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"), 
    app                     = express();

var indexRoutes         = require("./routes/index"),
    deviceRoutes        = require("./routes/devices"),
    locationRoutes      = require("./routes/locations"),
    settlementsRoutes   = require("./routes/settlements"),
    organizationRoutes  = require("./routes/organizations"),
    userRoutes          = require("./routes/users"),
    eventRoutes         = require("./routes/events"),
    transactionsRoutes  = require("./routes/transactions"),
    trans_uploadRoutes  = require("./routes/trans_upload"),
    User                = require("./routes/models/user");


app.use(parse.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
app.use(methodOverride("_method"));
app.use(parse.urlencoded({extended: true})); 


app.use(require("express-session")({
    secret: "Capstone Project",
    resave: false,
    saveUnitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000000 //1 hour
    }
}));

//Session handlers
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect("mongodb://localhost/authentication", { useNewUrlParser: true });

//-------------------------------Middleware----------------------------------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


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
<<<<<<< HEAD
app.use(settlementsRoutes);
=======
app.use(userRoutes);
app.use(transactionsRoutes);
app.use(trans_uploadRoutes);
<<<<<<< HEAD
>>>>>>> c279779c0670e8a42b99da4fe6ea7d346263537f
=======
app.use(User);
>>>>>>> 68c284c405bf360a3d232767d5c26a864d1e02b2


//-------------------------------SERVER INIT------------------------------------
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated (port " + process.env.PORT + ")...");
});