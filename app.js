
/**
 * Module dependencies.
 */
var express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    config = require("./config/config.js"),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    multer = require('multer'),
    // models
    User = require("./app/models/user");
    
// config
mongoose.connect(config.db.url);
require('./config/passport')(passport, User);    

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

app.configure(function() {
    // set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms
    
    app.set('view engine', 'jade');
    
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));
    app.use(flash());
});

// routes ======================================================================
require('./app/routes/user.js')(app, passport);
// launch ======================================================================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("STARTED");
});

// Manejo de sessiones 
app.get('/ejemplo', function(req, res){
    if(req.session.nombre){
        res.send('Hola ' + req.session.nombre);
    }else{
        var nombre = 'Tito';
        req.session.nombre = nombre;
        res.send('Hola usuario desconocido. De ahora en adelante te llamaremos ' + nombre);
    }
});