var passport = require('passport');
// Ruteos
exports.get('/', function(req, res){
    res.render('index', { title: 'Passport-Example', users: req.user })
;});
exports.get('/logout', function(req, res) { req.logout(); res.redirect('/');});
exports.get('/auth/facebook', passport.authenticate('facebook'));
exports.get('/auth/facebook/callback', passport.authenticate('facebook',  { successRedirect: '/', failureRedirect: '/' }));
exports.post('/login', function(req, res) {
});