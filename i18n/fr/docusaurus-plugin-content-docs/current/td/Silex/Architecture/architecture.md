---
id: silex-architecture
title: Architecture
sidebar_position: 10
---
---

![](/img/silex/silex_architecture.png)

## Espace utilisateur

Ces parties du pipeline Silex sont disponible sur la machine utilisateur.

### Silex desktop

Silex desktop est le principal outil utilisateur. Il contient l'accès utilisateur à la plupart des sercives Silex :

- Gestionnaire de fichiers
- Accès et action de l'artiste sur les DCC
- Nimby (Not In My BackYard: empêche la renderfarm d'utiliser cet ordinateur)
- Harvest, statistiques des films

Il communique à la fois avec le backend pour exécuter les requêtes de base de données et avec le service de socket silex pour assurer la communication avec le DCC.

Il s'agit d'une application électronique qui affiche le contenu à partir du serveur Front.

### Service Silex socket

Le service de socket Silex permet une communication en temps réel entre le Silex desktop et les DCC, via les actions client Silex.

### Client Silex

Silex client est un système d'action configurable, qui peut lancer des actions autonomes, généralement via des scripts Rez, ou des actions DCC  grâce à des plugins.

### Rez packages

Rez crée des environnements de travail spécifiques et configurables. Les packages Rez sont chargés pour assurer la création de cet environnement. Lors du lancement d'un DCCs par Silex, les artistes utilisent chaque fois un environnement Rez spécifique.

### Aiogazu

Aiogazu est une bibliothèque python qui résume les routes HTTP de la base de données. C'est un fork de Gazu, qui a été rendue asynchrone.

## Backend

### Serveur Front (Silex front end)

Ce serveur est ciblé par Silex desktop. C'est une application React qui contient le contenu affiché de Silex Desktop.

Il authentifie la base de données CG Wire. La plupart des requêtes passent par l'adaptateur GraphQL au lieu d'attaquer directement la base de données.

### Base de données du suivi de la production

Cette base de données contient toutes les données de production, qui est utilisé par le front Silex.

### Adaptateur GraphQL

GraphQL sert d'API pour faciliter les requêtes dans une base de données. Les requêtes (Queries) peuvent être configurées. C'est l'outil principal pour obtenir des données de la base de données.
