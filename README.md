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

## Démarrer le serveur Mongo - ReplicaSet

Pour démarrer les différents serveurs Mongo, il suffit de lancer les commandes suivantes :

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
