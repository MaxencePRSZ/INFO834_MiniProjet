# A destination des Enseignants

Ce que nous avons fait :
  - Récupération de chaque messages sous forme : {User : "", Message : ""} dans une bdd mongo
  - Requête pour savoir le nombre de messages envoyés par un utilisateur et ajout dans la page web (Le petit nombre à coté du nom utilisateur
  - Réécriture de certaines parties du code



# Socket.io : Chat

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

## Démarrer le serveur mongo

Pour démarrer le serveur mongo, il suffit de faire un 

```
mongod --dbpath ./data
```

là où vous voulez. Assurez vous qu'il démarre bien sur le port **http://localhost:27017/**.

## Démarrer l'application

Pour démarrer l'application, exécutez la commande suivante depuis la racine du projet.
```
node server
```

L'application est désormais accesssible à l'url **http://localhost:3000/**.
