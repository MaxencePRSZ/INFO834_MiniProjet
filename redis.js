var redis = require('redis');

var client = redis.createClient(); //creates a new client (utiliser var client = redis.createClient(port, host); si ports et host différents de 127.0.0.1 et 6379)
client.del("users")

//Gestion des erreurs
client.on("error", function(error) {
    console.error(error);
  });

//Affichage d'un message lors de la connexion à Redis
client.on('connect', function() {
    console.log('connected to Redis');
});

//Ajout d'un utilisateur au set 'users'
function add_connected_user(username){
    client.sadd(['users', username], function(err, reply) {
        return(reply);
    });
}

//Suppression d'un utilisateur du set 'users'
function remove_connected_user(username){
    client.srem(['users', username], function(err, reply) {
        return(reply);
    });
}

//Récupération de tous les utilisateurs du set 'users'
function get_connected_users(fn){
    client.smembers('users', function(err, reply) {
        // console.log(reply)
        fn(reply);
    })
}


module.exports = {
    add_connected_user : add_connected_user,
    remove_connected_user : remove_connected_user,
    get_connected_users : get_connected_users
}
