var Ra       = require('../app/models/ra'),
    multer = require('multer');
    var storage =   multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, '../uploads');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now());
        }
    });
    var upload = multer({ storage : storage });
    var fs = require('fs');
    var validUrl = require('valid-url'),
    im = require('imagemagick-stream');
    var Thumbbot = require('thumbbot');
    var youtube = require('youtube-validator');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        if(req.isAuthenticated())
            res.redirect("/profile/");
            
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    }).post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    }).post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


// google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    }).post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

// facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


// google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    app.get('/ra/:id', isLoggedIn, function(req, res, next){
        if(isNaN(req.params.id)){
            return next();
        }
        Ra.findOne({ '_id':req.params.id}, function(err, ra) {
            // if there are any errors, return the error
            if (err)
                return res.render('error.ejs', { message: err.message });

            if(!ra)
                res.render('ra.ejs', { message: "No existe la RA que estas buscando." });
                
            res.render('ra.ejs', {
                'ra' : ra,
                message : ''
            });
        });
    });
 
    app.get('/ra/', isLoggedIn, function(req, res){
        Ra.find({'userId' : req.user._id}, function(err, ras) {
            // if there are any errors, return the error
            if (err)
                return res.render('error.ejs', { message: err.message });
            
            if(!ras){
                res.render('ras.ejs', { message: "No existe ninguna RA en la base." });
            }
            
            res.render('ras.ejs', {
                'ras':ras,
                message : ''
            });
        });
    }).post('/ra/', isLoggedIn, addRaV, upload.fields([{ name: 'archivo'}, { name: 'patron'}]), function(req, res, next){
        var newRa = new Ra();
        try{
            // Guardo el patron en la carpeta patron.
            fs.createReadStream(req.files['patron'][0].path).pipe(fs.createWriteStream('../ra/patron/'+req.files['patron'][0].filename));
            fs.createReadStream(req.files['patron'][0].path).pipe(fs.createWriteStream('../ra/patron/thumb/'+req.files['patron'][0].filename));
            fs.createReadStream(req.files['patron'][0].path).pipe(fs.createWriteStream('../public/images/patron/'+req.files['patron'][0].filename+".jpg"));
            fs.unlink(req.files['patron'][0].path);
            newRa.patron = req.files['patron'][0].filename;
            
            if(req.body.tipo != "video"){
                // Lo guardo en su carpeta correspondiente.
                fs.createReadStream(req.files['archivo'][0].path).pipe(fs.createWriteStream('../ra/'+req.body.tipo+'/'+req.files['archivo'][0].filename));
                fs.createReadStream(req.files['archivo'][0].path).pipe(fs.createWriteStream('../ra/'+req.body.tipo+'/thumb/'+req.files['archivo'][0].filename));
                fs.unlink(req.files['archivo'][0].path);
                newRa.ruta = req.files['archivo'][0].filename;
                
            }else{
                youtube.validateUrl(req.body.archivo, function(res, err, next) {
                    if(err)
                        next(err);
                    else
                        newRa.ruta = req.body.archivo;
                });
            }    
            
            newRa.tipo = req.body.tipo;
            newRa.userId = req.user._id;
            newRa.save(function(err) {
                if (err)
                    return res.render('error.ejs', { message: err.message });
                
                 res.redirect("/ra/"+newRa._id);
            });
        }catch(e){
            return next(e);
        }
       
    });
    
    app.get('/ra/add/', isLoggedIn, function(req, res) {
        res.render('addRa.ejs', { message: req.flash('addRaMessage') });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next();

    res.redirect('/');
}

// route middleware to valid data
function addRaV(req,res,next){
    if(req.body.tipo)
    {
        if(req.body.tipo == "video"){
            if(!validUrl.isWebUri(req.body.ruta))
            {
                req.flash('message', 'Url de video invalida');
                res.redirect('/ra/add');
            }    
        }
        
    }
    return next();
}