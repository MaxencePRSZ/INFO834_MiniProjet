var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var SchemaMessage = new Schema({
    User : String, 
    Message : String,
    Salon : String
});

// Export Contact model
module.exports = {Message : mongoose.model('Message', SchemaMessage)};

