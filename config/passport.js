var mongoose = require('mongoose'),
    config = require('./config'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy   = require('passport-local').Strategy;
    

module.exports = function(passport, User) {
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

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err) return done(err);
            if (user) {
                return done(null, false, { message: 'That email is already taken.'});
            } else {
				// if there is no user with that email
                // create the user
                var newUser            = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : '',
        passwordField : '',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        User.findOne({"local.email" :  email }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Unknown user' });
            }
            if (!user.authenticate(password)) {
              return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
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
 