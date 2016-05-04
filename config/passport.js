var config = require('./config'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy   = require('passport-local').Strategy;
    
var User = require('../models/user');
    

module.exports = function(passport, User) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);
    
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
    
                    // if there is no user with that email
                    // create the user
                    var newUser            = new User();
    
                    // set the user's local credentials
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
    
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
    
            });    

        });

    }));
    
    passport.use("facebook",new FacebookStrategy({
        clientID: config.facebook.id,
        clientSecret: config.facebook.secret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'emails', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified','photos']
    }, function(accessToken, refreshToken, profile, done) {
        User.findOne({"facebook.oauthid": profile.id}, function(err, user) {
            if(err) throw(err);
            if(!err && user!= null) return done(null, user);
        
            var newUser = new User();
                newUser.facebook.oauthid = profile.id;
                newUser.facebook.createAt = Date.now();
                if(profile.emails && profile.emails.length>0){
                    newUser.facebook.email = profile.emails[0].value;    
                }
                newUser.facebook.name = profile.name.givenName+profile.name.familyName;
                newUser.photo = profile.photos[0].value;
            newUser.save(function(err) {
                if(err) throw err;
                done(null, newUser);
            });
        });
    }));
};
 