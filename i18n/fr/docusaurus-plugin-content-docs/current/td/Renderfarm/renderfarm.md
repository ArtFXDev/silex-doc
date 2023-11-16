---
id: renderfarm
title: Renderfarm
sidebar_position: 60
---

# Render farm

La render farm est un élément clé du pipeline. Il permet aux artistes de rendre leurs images en utilisant divers moteurs de rendu comme V-Ray, Redshift ou Arnold.

Après qu'un artiste a [conforme](../Silex/commonactions/conform)/[publish](../Silex/commonactions/publish) tous les fichiers nécessaires liés à une scène et la scène elle-même, il peut **submit** un job à la render farm.

## Concepts

### Job

Un **job** est le top level workload sur une render farm, elle est décrite avec un _nom_, une _priorité_ et la plupart du temps la spécification des ordinateurs à exécuter.

### Task

Habituellement, un **job** est composé de **tasks** qui sont de plus petites unités de travail à effectuer. Parr exemple un ordinateur peut rendre les frames de `1-10` et un autre de `11-20`.

### Commande

Une **task** a alors des **commandes** qui sont envoyées à l'ordinateur par un [Shell](<https://en.wikipedia.org/wiki/Shell_(computing)>) (par exemple `bash` dans le cas de Linux or `cmd.exe` pour Windows) ou directement interprétées par l'ordinateur.

Par exemple:

```shell
rez env vray test_pipe -- vray
  -skipExistingFrames=1
  -display=0
  -progressUseColor=0
  -progressUseCR=0
  -progressIncrement=5
  -verboseLevel=3
  -rtEngine=0
  -sceneFile=scene.vrscene
  -imgFile=out_frame.exr
  -frames=1;2;3;4;5;6;7;8;9;10
```

:::tip
La commande ci-dessus utilise [Rez](https://github.com/nerdvegas/rez/) qui est utilisé pour résoudre les **environnements**dynamiquement en définissant les **packages** et les variables d'environnement. Il est très utile dans une configuration de render farm puisque nous avons divers software packages et différentes **versions**.
:::

### Blade

Un **blade** est un ordinateur qui travaille sur la render farm. Il reçoit une **task** du master engine et exécute des commandes.

Le blade stocke et envoie les logs et mises à jour à l'engine.

### Engine

L'**engine** est le programme fonctionnant sur le serveur principal sur le réseau. Son job est de recevoir des demandes de jobs et d'envoyer et dispatch des tasks aux blades connectées. Il gère la priorité, les logs et une base de données où il stocke des informations sur ce qui se passe.

## Que lire ensuite

- Chez ArtFX, nous utilisons [Tractor](./tractor) qui est le système de render farm de Pixar.
- Consultez l'action [Submit](../Silex/commonactions/submit) pour savoir comment nous submittons les jobs.
- [Harvest](./harvest) est une interface statistique et API pour Tractor.
