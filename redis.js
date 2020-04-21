var redis = require('redis');



var client = redis.createClient(); //creates a new client (utiliser var client = redis.createClient(port, host); si ports et host différents de 127.0.0.1 et 6379)
var connected_users = [];


client.on('connect', function() {
    console.log('connected to Redis');
});

function add_connected_user(username){
    client.sadd(['users', username], function(err, reply) {
        return(reply);
    });
}

function remove_connected_user(username){
    client.srem(['users', username], function(err, reply) {
        return(reply);
    });
}




function get_connected_users(fn){
    client.smembers('users', function(err, reply) {
        fn(reply);
    })
}



add_connected_user('evan');
add_connected_user('maxence');



users = []
get_connected_users(function (list){
    users = list;
})
console.log(users)


