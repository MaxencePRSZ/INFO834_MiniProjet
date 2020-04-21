var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose')
var Models = require('./model')
var i;
const redisFuncs = require('./redis');

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
app.use('/', express.static(__dirname + '/public'));


/**
 * Historique des messages
 */
var messages = [];

/**
 * Liste des utilisateurs en train de saisir un message
 */
var typingUsers = [];

/**
 * Utilisateurs connectés
 */
var connected_users = [];

/**
 * Liste des salons
 */
var listSalon = []

/**
 * Connection à mongo
 */
var db = 'mongodb://localhost:27017/Miniproj';
mongoose.connect(db);


io.on('connection', function (socket) {

    /**
     * Utilisateur connecté à la socket
     */
    var loggedUser;

    /**
     * Emission d'un événement "user-login" pour chaque utilisateur connecté
     */

    for (i = 0; i < connected_users.length; i++) {
        socket.emit('user-login', connected_users[i]);
    }


    /** 
     * Emission d'un événement "chat-message" pour chaque message de l'historique
     */
    for (i = 0; i < messages.length; i++) {
        if (messages[i].username !== undefined) {
            socket.emit('chat-message', messages[i]);
        } else {
            socket.emit('service-message', messages[i]);
        }
    }

    /**
     * Déconnexion d'un utilisateur
     */
    socket.on('disconnect', function () {
        if (loggedUser !== undefined) {
            // Broadcast d'un 'service-message'
            var serviceMessage = {
                text: 'User "' + loggedUser.username + '" disconnected',
                type: 'logout'
            };
            socket.broadcast.emit('service-message', serviceMessage);

            // Suppression de la liste des connectés (dans Redis)
            redisFuncs.remove_connected_user(loggedUser.username);
            // Suppression de la liste des connectés 
            var userIndex = connected_users.indexOf(loggedUser);
            if (userIndex !== -1) {
                connected_users.splice(userIndex, 1);
            }
            // Ajout du message à l'historique
            messages.push(serviceMessage);
            // Emission d'un 'user-logout' contenant le user
            io.emit('user-logout', loggedUser);
            // Si jamais il était en train de saisir un texte, on l'enlève de la liste
            var typingUserIndex = typingUsers.indexOf(loggedUser);
            if (typingUserIndex !== -1) {
                typingUsers.splice(typingUserIndex, 1);
            }
        }
    });

    /**
     * Connexion d'un utilisateur via le formulaire :
     */
    socket.on('user-login', function (user, callback) {

        // Vérification que l'utilisateur n'existe pas
        var userIndex = -1;
        for (i = 0; i < connected_users.length; i++) {
            if (connected_users[i].username === user.username) {
                userIndex = i;
            }
        }

        if (user !== undefined && userIndex === -1) { // S'il est bien nouveau
            // Sauvegarde de l'utilisateur et ajout à la liste des connectés
            loggedUser = user;
            loggedUser.nbMessages = 0;


            //Ajoute l'utilisateur à la liste des utilisateurs connectés
            connected_users.push(loggedUser);
            //Ajoute l'utilisateur à la base de donnée Redis (utilisateurs connectés)
            redisFuncs.add_connected_user(loggedUser.username);

            //Recupération du nombre de message de l'utilisateur
            Models.Message.aggregate([{ $match: { User: loggedUser.username } }, { $sortByCount: "$User" }], function (err, result) {
                if (err) throw err;
                if (result[0] !== undefined)
                    loggedUser.nbMessages = result[0].count

                // Envoi et sauvegarde des messages de service
                var userServiceMessage = {
                    text: 'You logged in as "' + loggedUser.username + '"',
                    type: 'login'
                };
                var broadcastedServiceMessage = {
                    text: 'User "' + loggedUser.username + '" logged in',
                    type: 'login'
                };
                socket.emit('service-message', userServiceMessage);
                socket.broadcast.emit('service-message', broadcastedServiceMessage);
                messages.push(broadcastedServiceMessage);
                io.emit('user-login', loggedUser);
                // appel du callback
                callback(true);
            });

        } else {
            callback(false);
        }
    });

    /**
     * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
     */
    socket.on('chat-message', function (message) {
        // On ajoute le username au message et on émet l'événement
        message.username = loggedUser.username;

        // Creation du message Mongo
        var newMessage = Models.Message({ User: message.username, Message: message.text });

        // Sauvegarde du message dans mongo
        newMessage.save(function (err) {
            if (err) return handleError(err);
            // Message sauvegardé
            // Mis à jour du nombre de message
            Models.Message.aggregate([{ $match: { User: message.username } }, { $sortByCount: "$User" }], function (err, result) {
                message.nbMessage = 0
                if (result[0] !== undefined)
                    message.nbMessage = result[0].count

                io.emit('chat-message', message);
                // Sauvegarde du message
                messages.push(message);
                if (messages.length > 150) {
                    messages.splice(0, 1);
                }
            });
        });
    });

    /**
     * Réception de l'événement 'start-typing'
     * L'utilisateur commence à saisir son message
     */
    socket.on('start-typing', function () {
        // Ajout du user à la liste des utilisateurs en cours de saisie
        if (typingUsers.indexOf(loggedUser) === -1) {
            typingUsers.push(loggedUser);
        }
        io.emit('update-typing', typingUsers);
    });

    /**
     * Réception de l'événement 'stop-typing'
     * L'utilisateur a arrêter de saisir son message
     */
    socket.on('stop-typing', function () {
        var typingUserIndex = typingUsers.indexOf(loggedUser);
        if (typingUserIndex !== -1) {
            typingUsers.splice(typingUserIndex, 1);
        }
        io.emit('update-typing', typingUsers);
    });
});

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
http.listen(3000, function () {
    console.log('Server is listening on *:3000');
});



function getAllMessagesFromUser(username) {
    // Pour avoir le nombre de message total (toutes rooms confondues) d'un utilisateur
    Models.Message.aggregate([{ $match: { User: username } }, { $sortByCount: "$User" }], function (err, result) {
        console.log(result);
    })
}

function getAllUsers() {
    return null;
}