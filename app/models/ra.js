// app/models/user.js
// load the things we need
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);
// define the schema for our user model
var raSchema = mongoose.Schema({

    id      :   String,
    tipo    :   String,
    ruta    :   String,
    patron  :   String,
    userId  :   String

});

raSchema.plugin(autoIncrement.plugin, 'Ra');
// create the model for users and expose it to our app
module.exports = mongoose.model('Ra', raSchema);