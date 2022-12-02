---
id: backend
title: Backend
sidebar_position: 50
---
---

Le backend de Silex est composé de plusieurs services qui peuvent être déployés à l'aide du repository [`silex-deploy`](https://github.com/ArtFXDev/silex-deploy).

## Déploiement

Nous utilisons [Docker](https://www.docker.com/) pour package les applications comme conteneurs isolés et [`docker compose`](https://docs.docker.com/compose/) pour définir une **pile d'applications multi-containeurs**.

C'est génial car le déploiement de la plupart des applications Silex backend est aussi simple que (voir détails [ici](https://github.com/ArtFXDev/silex-deploy)):

```shell
$ git clone https://github.com/ArtFXDev/silex-deploy.git
$ cd silex-deploy
$ docker-compose --env-file .env up -d
```

_(et la configuration aditionnale...)_

## Services

- [silex-doc](https://github.com/ArtFXDev/silex-doc)
- [silex-front](https://github.com/ArtFXDev/silex-front)
- [zou](https://github.com/ArtFXDev/zou) (ArtFXDev fork)
- [kitsu](https://github.com/ArtFXDev/kitsu) (ArtFXDev fork)
- [harvest-api](https://github.com/ArtFXDev/harvest-api)
- [harvest-ui](https://github.com/ArtFXDev/harvest-ui)
