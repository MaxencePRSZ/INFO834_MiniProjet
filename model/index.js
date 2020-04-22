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


function getAllMessagesFromUser(username) {
    // Pour avoir le nombre de message total (toutes rooms confondues) d'un utilisateur
    Message.aggregate([{ $match: { User: username } }, { $sortByCount: "$User" }], function (err, result) {
        console.log(result);
    })
}

function getLastSalon(){
    Message.find({}, {Salon: 1, _id: 0}, function(err , result){
        console.log(result)
    });
}


function getAllUsers() {
    Message.aggregate([{ $group: { _id: "$User" } }], function (err, result) {
        console.log(result.la);
    })
}



// Export Contact model
module.exports = {
    Message: Message,
    getUsersMessageNumbers: getUsersMessageNumbers
};

