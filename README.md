Ce projet de serveur de chat a été réalisé dans le cadre du cours d'INFO834 "Bases de données distribuées" à Polytech Annecy, par Maxence Personnaz et Evan Dadure (https://github.com/evandadure).

# A destination des Enseignants

Ce que nous avons fait :
  - Récupération de chaque messages sous forme : {User : "", Message : "", Salon : ""} dans une BDD mongo
    (exemple : {User : "Evan", Message : "Bonjour !", Salon : "1"}
  - Affichage du nombre de messages envoyés par un utilisateur dans l'interface de chat
  - Stockage des messages (et de leur users et salons) dans Mongo
  - Stockage en temps réel des utilisateurs connectés dans Redis (avec flush de la BDD au lancement du serveur)
  - Utilisation du ReplicaSet pour palier aux pannes éventuelles
  - Diverses fonctions relatives aux données des messages
    - Affichage d'une conversation précédente entre des utilisateurs
    - Récupération de tous les messages d'un utilisateur
    - Récupération de tous les messages d'un utilisateur dans un salon spécifique
    - Récupération de tous les utilisateurs qui ont particité à une discussion
  - Réécriture de certaines parties du code de base
  

# Notre serveur de chat

Cette application reprend les sources du tutoriel présent sur le blog [bini.io](http://blog.bini.io) :

* [Partie 1](http://blog.bini.io/developper-une-application-avec-socket-io/)
* [Partie 2](http://blog.bini.io/developper-un-chat-avec-socket-io-partie-2/)
* [Partie 3](http://blog.bini.io/developper-un-chat-avec-socket-io-partie-3/)

Ce tutoriel est lui même une adaptation du [tutoriel officiel](http://socket.io/get-started/chat/) de socket.io.

## Installation

Si vous n'avez pas bower d'installé sur votre machine, installez-le au préalable de la façon suivante :
```
npm install -g bower
```

Pour installer l'application, téléchargez les sources (zip ou git clone) et exécutez la commande suivante depuis la racine du projet.
```
npm install
bower install
```

## Démarrer le serveur Mongo - ReplicaSet

Pour démarrer les différents serveurs Mongo, il suffit de lancer les commandes suivantes (en s'assurant au préalable que les différents dossiers de stockages existent) :
```
mongod --replSet rs0 --port 27018 --dbpath "MiniProjet\data\R0S1"
mongod --replSet rs0 --port 27019 --dbpath "MiniProjet\data\R0S2"
mongod --replSet rs0 --port 27020 --dbpath "MiniProjet\data\R0S3"
mongod --replSet rs0 --port 30000 --dbpath "MiniProjet\data\arb"
```

Après avoir démarrer les 3 premiers serveurs et l'arbitre, il faut maintenant spécifier le serveur Primary :
```
mongo --port 27018
rs.initiate()
```

Ensuite, on va pouvoir ajouter les deux serveurs Secondary au ReplicaSet :
```
rs.add("localhost:27019")
rs.add("localhost:27020")
```

On va pouvoir définir l'arbitre avec la commande suivante :
```
rs.addArb("localhost:30000")
```

Finalement, on vérifie que tout marche avec la commande suivante :
```
rs.status()
```

## Démarrer l'application

Pour démarrer l'application, assurez-vous :
  - d'avoir bien récupéré les sources du projet
  - d'avoir démarré les serveurs Mongo en ReplicaSet (et qu'ils soient bien connectés entre eux)
  - d'avoir démarré votre serveur Redis (qui écoute sur le port 6379 par défaut, sinon voir redis.js)

Exécutez la commande suivante depuis la racine du projet.
```
node server
```

L'application est désormais accesssible à l'url **http://localhost:3000/**. Faites-vous plaisir, vous pouvez maintenant discuter avec vos amis en toute liberté !
