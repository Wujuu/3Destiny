module.exports = function(app, passport) {
    // routes
    app.get('/', function(req, res){
		if(req.isAuthenticated()){
	        res.render('index', { title: 'Passport-Example', users: req.user });
		}else{
			res.render('index', { title: 'Passport-Example', users : null});
		}
    ;});
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook',  { successRedirect: '/', failureRedirect: '/' }));
    app.get("/login", function(req, res){ 
		res.render("login");
	});

	app.post("/auth/login" , function(req, res) {
	    passport.authenticate('local-login')(req, res, function () {
            res.redirect('/');
        });
	});

	app.get("/auth/signup", function (req, res) {
		res.render("signup");
	});
	app.post("/auth/signup",  function(req, res) {
	    passport.authenticate('local-signup',  {
	        successRedirect: '/', 
	        failureRedirect: '/' 
	    });
	});
    app.get('/logout', function(req, res) { req.logout(); res.redirect('/');});
}
// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}