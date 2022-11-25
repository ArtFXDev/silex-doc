---
title: Harvest
sidebar_position: 15
---

![](https://github.com/ArtFXDev/harvest-ui/blob/main/img/harvest_home_page.png?raw=true)

Harvest est un tableau de bord de statistiques et API pour la [render farm de Tractor de Pixar](../Tractor).

Harvest se compose de deux repositories principaux :

- L'application front-end écrite dans React: [`harvest-ui`](https://github.com/ArtFXDev/harvest-ui)
- L'API backend écrite en Typescript avec [Prisma](https://www.prisma.io/): [`harvest-api`](https://github.com/ArtFXDev/harvest-api)

## API

Harvest a une API REST accessible à http://harvest.preprod.silex.artfx.fr/api/, voici les routes actuels :

```json
{
  "/history/project-usage",
  "/history/blade-usage",
  "/current/blade-usage",
  "/current/project-usage",
  "/info/compute-time",
  "/info/projects",
  "/info/blades",
  "/info/running-jobs",
  "/info/jobs-per-owner",
  "/history/jobs-per-owner",
  "/info/jobs-per-project",
  "/fog/groups",
}
```
