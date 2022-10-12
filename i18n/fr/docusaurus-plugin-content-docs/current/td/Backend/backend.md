---
id: backend
title: Backend
sidebar_position: 50
---
---

The backend of Silex is composed of multiple services that can be deployed using the [`silex-deploy`](https://github.com/ArtFXDev/silex-deploy) repository.

## Deployment

We use [Docker](https://www.docker.com/) to package applications as isolated containers and [`docker compose`](https://docs.docker.com/compose/) to define a **multi-container application stack**.

This is great because deploying most of the Silex backend applications is as simple as (see details [here](https://github.com/ArtFXDev/silex-deploy)):

```shell
$ git clone https://github.com/ArtFXDev/silex-deploy.git
$ cd silex-deploy
$ docker-compose --env-file .env up -d
```

_(and aditionnal configuration...)_

## Services

- [silex-doc](https://github.com/ArtFXDev/silex-doc)
- [silex-front](https://github.com/ArtFXDev/silex-front)
- [zou](https://github.com/ArtFXDev/zou) (ArtFXDev fork)
- [kitsu](https://github.com/ArtFXDev/kitsu) (ArtFXDev fork)
- [harvest-api](https://github.com/ArtFXDev/harvest-api)
- [harvest-ui](https://github.com/ArtFXDev/harvest-ui)
