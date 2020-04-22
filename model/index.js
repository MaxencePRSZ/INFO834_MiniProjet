var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var SchemaMessage = new Schema({
    User: String,
    Message: String,
    Salon: String
});

var Message = mongoose.model('Message', SchemaMessage)

function getUsersMessageNumbers(username, func) {
    var ret = 0
    Message.aggregate([{ $match: { User: username } }, { $sortByCount: "$User" }], function (err, result) {
        if (err) throw err;
        if (result[0] !== undefined)
            ret = result[0].count;
        func(ret);
    });

}

// Export Contact model
module.exports = {
    Message: Message,
    getUsersMessageNumbers : getUsersMessageNumbers
};

