---
id: zou
title: Zou
sidebar_position: 10
---

---

[Zou](https://zou.cg-wire.com/) est la base de données de l'écosystème CGWire.

Il nous permet de **stocker les données de production** pour les films, y compris les séquences, les shots, les assets, les utilisateurs, les templates de fichiers, les customs entities...

## Configuration

### `zou-deploy`

[`zou-deploy`](https://github.com/ArtFXDev/zou-deploy) est me repository qui contient des scripts pour remplir automatiquement la base de données Zou avec des utilisateurs, des projets et d'autres entités.

Il s'appuie sur les fichiers de configuration `.csv` et JSON pour remplir la base de données.

### Arborescence de fichiers

Chaque chemin du pipeline est défini par une configuration `JSON` qui décrit comment un chemin pour une certaine entité doit être construit.

Un exemple concerne les fichiers **published** :

```json
{
  "output": {
    "mountpoint": "P:",
    "root": "",
    "folder_path": {
      "shot": "<Project>/shots/<Sequence>/<Shot>/<TaskType>_<Name>/publish/v<Version>/<OutputType>",
      "asset": "<Project>/assets/<AssetType>/<Asset>/<TaskType>_<Name>/publish/v<Version>/<OutputType>",
      "sequence": "<Project>/sequences/<Sequence>/<TaskType>_<Name>/publish/v<Version>/<OutputType>",
      "scene": "<Project>/scenes/<Sequence>/<Scene>/<TaskType>_<Name>/publish/v<Version>/<OutputType>",
      "rushes": "<Project>/rushes/<Resolution>/<Sequence>/<Shot>",
      "style": "lowercase"
    },
    "file_name": {
      "shot": "<Project>_<Sequence>_<Shot>_<TaskType>_<Name>_publish_v<Version>",
      "asset": "<Project>_<AssetType>_<Asset>_<TaskType>_<Name>_publish_v<Version>",
      "sequence": "<Project>_<Sequence>_<TaskType>_<Name>_publish_v<Version>",
      "scene": "<Project>_<Sequence>_<Scene>_<TaskType>_<Name>_publish_v<Version>",
      "style": "lowercase"
    }
  }
}
```

:::tip
Voir la [documentation](https://zou.cg-wire.com/file_trees/) sur les arbres de fichiers pour voir quelles entités vous pouvez utiliser.
:::

:::caution
Assurez-vous d'ajouter un champ `nas` dans le champ de `données` d'un projet. Cela contiendra le NAS où le projet est situé. (ceci est ajouté dans `zou-deploy`)

Par exemple :

```json
{
  "id": "4142bd7f-d92a-44f0-a5e8-7968b2ed6532",
  "name": "MACULA",
  "data": "{\"nas\": \"ana\"}"
}
```

Il est utilisé lors du rendering sur la [render farm](../../Silex/CommonActions/Submit/implementsubmitter#wrapping-with-the-mount-command).

:::

#### Accès réseau direct aux fichiers

Si vous voulez mettre un projet sur un lecteur réseau et accéder aux fichiers directement, changez la clé `mountpoint` dans le template de fichier `//server/...` comme :

```json
{
  "working": {
    "mountpoint": "//marvin/WIP/PIPELINE",
    "root": ""
    // ...
  }
}
```

_(exemple : [`file_tree_marvin.json`](https://github.com/ArtFXDev/zou-deploy/blob/main/data/file_tree_marvin.json) pour le projet spécial FranceTV)_

## API

### REST

Zou a une API REST disponible à http://kitsu.prod.silex.artfx.fr/api/ (par exemple).

Voir les [routes disponibles dans la documentation](https://zou.cg-wire.com/api/).

### GraphQL

Parce que nous avons forked Zou, nous avons ajouté une [API GraphQL](https://graphql.org/) utilisant [`graphene-python`](https://graphene-python.org/). Il est très utile pour la récupération de données front-end puisque vous pouvez interroger ce que vous voulez.

Utilisez l'url `/api/graphql` pour obtenir un éditeur [GraphiQL](https://github.com/graphql/graphiql) intégré :

![](/img/graphiql.png)

Sinon, vous pouvez utiliser le grand GraphQL IDE appelé [client Altair](https://altair.sirmuel.design/).

:::info
Notez que l'API GraphQL n'est **disponible que pour la récupération de données** pour l'instant. Le support pour les [mutations](https://graphql.org/learn/queries/#mutations) pourrait être ajouté à l'avenir.
:::
