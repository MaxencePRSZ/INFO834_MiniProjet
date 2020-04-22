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

//Get last Salon
function getLastSalon(func){
    Message.find({}, { Salon : 1 }).sort({Salon : -1}).limit(1).exec( function(err, result) {
        if (err) throw err;
        if (result[0] !== undefined)
            ret = result[0].Salon;
        func(ret);
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
    getUsersMessageNumbers: getUsersMessageNumbers,
    getLastSalon : getLastSalon
};

