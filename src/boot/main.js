require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, '..', 'views');
const logger = require('morgan');
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");
const passportConfig = require("./passport");

module.exports = {
  init(app, express){
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressValidator());
    app.use(session({
      secret: process.env.cookie_secret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e9 }
    }));
    app.use(flash());
    passportConfig.init(app);
    app.use((req,res,next) => {
      res.locals.user = req.user;
      next();
    })
    app.use(express.static(path.join(__dirname, '..', 'assets')));
  }
};