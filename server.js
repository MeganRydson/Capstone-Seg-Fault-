var express             = require("express"),
    parse               = require("body-parser"),
    db                  = require("mysql"),
    mailer              = require("nodemailer"),
    redirectToHTTPS     = require("express-http-to-https").redirectToHTTPS,
    app                 = express(),
    OktaJwtVerifier     = require('@okta/jwt-verifier'),
    cors = require('cors');
    
var indexRoutes         = require("./routes/index"),
    deviceRoutes        = require("./routes/devices"),
    locationRoutes      = require("./routes/locations"),
    eventsRoutes        = require("./routes/events"),
    organizationRoutes  = require("./routes/organizations");


app.use(parse.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

//-------------------------------OKTA CONNECTION----------------------------------
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-130586.okta.comt',
  clientId: '0oafqgqv4eKur0kug356',
  assertClaims: {
    aud: 'api://default',
  },
});

function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    return res.status(401).end();
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}

app.use(cors());

app.get('/', authenticationRequired, (req, res) => {
  res.json(req.jwt);
});

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