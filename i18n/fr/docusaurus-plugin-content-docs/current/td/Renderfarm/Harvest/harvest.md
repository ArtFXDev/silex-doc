---
title: Harvest
sidebar_position: 15
---

![](https://github.com/ArtFXDev/harvest-ui/blob/main/img/harvest_home_page.png?raw=true)

Harvest is a statistics dashboard and API for [Pixar's Tractor render farm](../Tractor).

Harvest consists of two main repositories:

- The front-end application written in React: [`harvest-ui`](https://github.com/ArtFXDev/harvest-ui)
- The backend API written in Typescript with [Prisma](https://www.prisma.io/): [`harvest-api`](https://github.com/ArtFXDev/harvest-api)

## API

Harvest have a REST API accessible at http://harvest.preprod.silex.artfx.fr/api/, here are the current routes:

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
