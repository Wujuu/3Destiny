module.exports = function(app, multer) {
    app.post('/', multer({ dest: 'uploads/'}).single('upl'), function(req,res){
    	res.status(204).end();
    });
}