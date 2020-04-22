var mongoose = require('mongoose')
var Schema = mongoose.Schema;

//Schéma de message, qui correspond à la structure de la bdd...
var SchemaMessage = new Schema({
    User: String,
    Message: String,
    Salon: String
});

var Message = mongoose.model('Message', SchemaMessage)

//Récupération du nombre de message d'un utilisateur
function getUsersMessageNumbers(username, func) {
    var ret = 0
    Message.aggregate([{ $match: { User: username } }, { $sortByCount: "$User" }], function (err, result) {
        if (err) throw err;
        if (result[0] !== undefined)
            ret = result[0].count;
        func(ret);
    });
}

//Récupération de tous les messages d'un users spécifique
function getAllMessagesFromUser(username) {
    // Pour avoir le nombre de message total (toutes rooms confondues) d'un utilisateur
    Message.aggregate([{ $match: { User: username } }, { $sortByCount: "$User" }], function (err, result) {
        console.log(result);
    })
}

//Récupération du dernier salon, c'est à dire le salon avec l'ID la plus grande
function getLastSalon(func){
    Message.find({}, { Salon : 1 }).sort({Salon : -1}).limit(1).exec( function(err, result) {
        if (err) throw err;
        if (result[0] !== undefined)
            ret = result[0].Salon;
        func(ret);
   });
}

//Récupération de tous les messages d'un utilisateur dans un salon spécifique
function getMessageFromUserInSalon(username, salon, func){
    Message.find({User : username, Salon : salon}).exec(function(err, result){
        if (err) throw err;
        if (result !== undefined)
            ret = result;
        func(ret);
    });
}

//Récupération de tous les messages d'un salon spécifique
function getMessageFromSalon( salon, func){
    Message.find({Salon : salon}).exec(function(err, result){
        if (err) throw err;
        if (result !== undefined)
            ret = result;
        func(ret);
    });
}


//Récupération de tous les utilisateurs qui ont particité à une discussion
function getAllUsers() {
    Message.aggregate([{ $group: { _id: "$User" } }], function (err, result) {
        console.log(result.la);
    })
}



// Export Contact model
module.exports = {
    Message: Message,
    getUsersMessageNumbers: getUsersMessageNumbers,
    getLastSalon : getLastSalon,
    getAllUsers : getAllUsers,
    getMessageFromSalon : getMessageFromSalon,
    getMessageFromUserInSalon : getMessageFromUserInSalon,
    getAllMessagesFromUser : getAllMessagesFromUser
};

