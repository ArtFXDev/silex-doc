---
id: td-gokillprocess
title: Gokillprocess
---

## Présentation

Gokillprocess est utilisé pour obtenir des listes de processus en cours d'exécution, des services, kill un processus en cours avec PID et redémarrer un service avec son nom, via une requête HTTP.

## Déploiement

Vous pouvez retrouver la partie déploiement dans la doc IT [ici](/docs/it/scripts/deploy-gokillprocess).

## Structure de Projet

```
📦go_killprocessbywebserver
 ┣ 📂middlewares
 ┃ ┗ 📜middlewares.go
 ┣ 📂responses
 ┃ ┗ 📜responses.go
 ┣ 📂server
 ┃ ┣ 📜controllers.go
 ┃ ┣ 📜routes.go
 ┃ ┗ 📜server.go
 ┣ 📜.gitattributes
 ┣ 📜go.mod
 ┣ 📜go.sum
 ┗ 📜main.go
```

## Middlewares Package

- Définir facilement les en-têtes de demande dans les routes

## Package Responses

- Méthodes pour retourner un message formaté

## Serveur de Package

- Controllers.go: Recevoir les requêtes http et les traiter.
- Routes.go: Routes http de l'application.
- Server.go: Définit l'objet Server et contient l'exécution de la fonction principale de serveur

## main.go

- Main de l'application
