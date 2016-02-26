module.exports = function(app, passport) {
    // routes
    app.get('/', function(req, res){
        res.render('index', { title: 'Passport-Example', users: req.user })
    ;});
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook',  { successRedirect: '/', failureRedirect: '/' }));
    app.post('/login', function(req, res) {
        
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