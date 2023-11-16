---
id: socket-service
title: Présentation générale
sidebar_position: 10
---

WebSocket serveur est un pont entre DCCs et frontend.

Les interfaces DCCs et Silex doivent communiquer en temps réel, et nous utilisons un serveur socket pour cela. Vous pouvez imaginer un serveur socket comme une chat room, où chaque client est connecté et peut envoyer des requêtes. Comme Silex desktop frontend et les DCCs sont connectés sur le même service de socket, ils peuvent intéragir.

Afin de réaliser la Séparation des Préoccupations (Separation of Concerns), ce n'est ni l'interface de bureau Silex ni les DCCs qui effectuent les actions de fichier, mais le Service Silexsocket lui-même.

Silex Socket Service utilise la bibliothèque Socket-io.
Socket-io est un protocole qui utilise WebSocket.

## Pour commencer

En autonome :

- obtenir la dernière version
- `yarn`
- `yarn start`

Dans le projet du bureau :

- Créez .npmrc à côté de package.json et mettez ça dans :
- ```
  //npm.pkg.github.com/:_authToken=<YOUR_GITHUB_TOKEN>  # only if your repository is private
  @ArtFXDev:registry=https://npm.pkg.github.com/
  ```
  **Ne pas oublier de remplacer <YOUR_GITHUB_TOKEN> par votre token d'accès github**, réf : [ici](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- `npm install @artfxdev/silex-socket-service`
