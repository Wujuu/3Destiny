var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res){
    if(req.isAuthenticated()){
        res.render('index', { title: 'Passport-Example', users: req.user });
    }else{
        res.render('index', { title: 'Passport-Example', users : null});
    }
});

module.exports = router;
