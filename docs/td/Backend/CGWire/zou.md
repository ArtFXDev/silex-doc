---
id: zou
title: Zou
sidebar_position: 10
---

[Zou](https://zou.cg-wire.com/) is the database of the CGWire ecosystem.

It allows us to **store the production data** for movies including sequences, shots, assets, users, file templates, custom entities...

## Configuration

### `zou-deploy`

[`zou-deploy`](https://github.com/ArtFXDev/zou-deploy) is the repository that hold scripts to automatically fill the Zou database with users, projects and other entities.

It relies on `.csv` and JSON configuration files to fill the database.

### File tree

Each path of the pipeline is defined by a `JSON` configuration that describes how a path for a certain entity should be built.

An example is for **published** files:

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
See the [documentation](https://zou.cg-wire.com/file_trees/) about file trees to see which entities you can use.
:::

:::caution
Make sure to add a `nas` field in the `data` field of a project. This will contain the NAS where the project is located. (this is added in `zou-deploy`)

For example:

```json
{
  "id": "4142bd7f-d92a-44f0-a5e8-7968b2ed6532",
  "name": "MACULA",
  "data": "{\"nas\": \"ana\"}"
}
```

It is used when rendering on the [render farm](../../Silex/CommonActions/Submit/implementsubmitter#wrapping-with-the-mount-command).

:::

#### Direct network access to files

If you want to put a project on a network drive and access the files directly, change the `mountpoint` key in the file template to `//server/...` like:

```json
{
  "working": {
    "mountpoint": "//marvin/WIP/PIPELINE",
    "root": ""
    // ...
  }
}
```

_(example: [`file_tree_marvin.json`](https://github.com/ArtFXDev/zou-deploy/blob/main/data/file_tree_marvin.json) for FranceTV special project)_

## API

### REST

Zou has a REST API available at http://kitsu.prod.silex.artfx.fr/api/ (for example).

See the [available routes in the documentation](https://zou.cg-wire.com/api/).

### GraphQL

Because we forked Zou, we added a [GraphQL API](https://graphql.org/) using [`graphene-python`](https://graphene-python.org/). It is very useful for front-end data fetching since you can query what you want.

Use the `/api/graphql` url to get an intergrated [GraphiQL](https://github.com/graphql/graphiql) editor:

![](/img/graphiql.png)

Otherwise you can use the great GraphQL IDE called [Altair client](https://altair.sirmuel.design/).

:::info
Note that the GraphQL API is for **data fetching only** for now. Support for [mutations](https://graphql.org/learn/queries/#mutations) could be added in the future.
:::
