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
            if(err)
                return err;
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            if(err)
                return err;
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            if(err)
                return err;
                
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

    app.get('/ra/:id/edit', isLoggedIn, function(req, res, next) {
        Ra.findOne({'_id':req.params.id, 'userId' : req.user._id}, function(err, ra) {
            // if there are any errors, return the error
            if (err)
                return res.render('error.ejs', { message: err.message });
            
            if(!ra){
                res.render('addRa.ejs', { message: "No existe dicha RA en tu galeria." });
            }
            res.render('addRa.ejs', { message: req.flash('addRaMessage'), 'ra':ra });
        });
    });

    app.get('/ra/:id/remove', isLoggedIn, function(req, res, next) {
        Ra.remove({'_id':req.params.id, 'userId' : req.user._id}, function(err) {
            // if there are any errors, return the error
            if (err)
                return res.render('error.ejs', { message: err.message });
        
            res.redirect('/ra/');
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
    });
    
    app.get('/ra/add/', isLoggedIn, function(req, res) {
        res.render('addRa.ejs', { message: req.flash('addRaMessage') });
    }).post('/ra/add', isLoggedIn, addRAV, upload.fields([{ name: 'archivo'}, { name: 'patron'}]), function(req, res, next){
        var newRa = new Ra();
        try{
            crearPatron(req.files['patron'][0]);
            newRa.patron = req.files['patron'][0].filename;
            
            if(req.body.tipo != "video"){
                crearRAImage(req.files['archivo'][0], req.body.tipo);
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
       
    }).post('/ra/edit', isLoggedIn, editRAV, upload.fields([{ name: 'archivo'}, { name: 'patron'}]), function(req, res, next){
        Ra.find({'_id' : req.body.id}, function(err, ra) {
            if (err)
                return res.render('error.ejs', { message: err.message });
                
            try{
                if(req.files['patron'][0])
                {
                    fs.unlink('../ra/patron/'+ra.patron);
                    fs.unlink('../public/images/patron/'+ra.patron+".jpg");
                    crearPatron(req.files['patron'][0]);
                    ra.patron = req.files['patron'][0].filename;
                }
                if(req.body.tipo != "video")
                {
                    if(req.files['archivo'][0])
                    {
                        fs.unlink('../ra/'+ra.tipo+'/'+ra.ruta);
                        crearRAImage(req.files['archivo'][0], req.body.tipo);
                        ra.ruta = req.files['archivo'][0].filename;
                    }
                }
                else
                {
                    ra.ruta = req.body.archivo;
                }    
                
                ra.tipo = req.body.tipo;
                ra.userId = req.user._id;
                ra.save(function(err) {
                    if (err)
                        return res.render('error.ejs', { message: err.message });
                    
                     res.redirect("/ra/"+ra._id);
                });
            }catch(e){
                return next(e);
            }
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next();

    res.redirect('/');
}

// route middleware to valid data
function addRAV(req,res,next){
    if(req.body.tipo)
    {
        if(req.body.tipo == "video"){
            youtube.validateUrl(req.body.archivo, function(res, err, next) {
                if(err)
                {
                    req.flash('message', 'Url de video invalida');
                    res.redirect('/ra/add');
                }                
            });
            
        }else{
            if(!req.files['patron'][0] || !req.files['archivo'][0]){
                req.flash('message', 'Por favor cargue algun archivo en RA y Patron');
                res.redirect('/ra/add');
            }
        }
        
    }
    return next();
}

// route middleware to valid data
function editRAV(req,res,next){
    if(req.body.tipo)
    {
        if(req.body.tipo == "video"){
            youtube.validateUrl(req.body.archivo, function(res, err, next) {
                if(err)
                {
                    req.flash('message', 'Url de video invalida');
                    res.redirect('/ra/add');
                }                
            });
            
        }
        
    }
    return next();
}

function crearPatron(file) {
    // Guardo el patron en la carpeta patron.
    fs.createReadStream(file.path).pipe(fs.createWriteStream('../ra/patron/'+file.filename));
    fs.createReadStream(file.path).pipe(fs.createWriteStream('../public/images/patron/'+file.filename+".jpg"));
    fs.unlink(file.path);
}

function crearRAImage(file, tipo) {
    // Lo guardo en su carpeta correspondiente.
    fs.createReadStream(file.path).pipe(fs.createWriteStream('../ra/'+tipo+'/'+file.filename));
    fs.unlink(file.path);
}