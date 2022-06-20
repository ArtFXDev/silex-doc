---
id: github
title: Git & GitHub
---

All the code of Silex is hosted on GitHub in the [ArtFXDev](https://github.com/ArtFXDev) organisation:

![](/img/silex_repositories.png)

## Conventions

### `README.md`

Silex is supposed to be **open-source** so the repositories needs to be well presented and clean. We use a similar structure for every `README.md` files line on [`silex-front`](https://github.com/ArtFXDev/silex-front#readme).

### Repository naming

- For Rez packages, we use underscores `_` because an hyphen denote a version for Rez. (examples: `silex_houdini`, `silex_client`)

- For other repositories it's usually `silex-*` with hyphens (`-`). (examples: `silex-front`, `silex-socket-service`)

## Branches and Pull requests

For the critical repositories, we usually have `dev`, `beta` and `prod` branches. This is the case for [`silex_client`](https://github.com/ArtFXDev/silex_client).

A developer working on the repository might go like this:

```
feature-branch1 -> dev -> beta -> prod
```

1. Go on the `dev` branch: `git checkout dev`
2. Create a feature branch: `git checkout -b feature-branch1`
3. Make changes and commit: `git add ... && git commit -m "my feature"`
4. Push those changes on GitHub: `git push origin feature-branch1`
5. Create a pull request on GitHub
6. Another person review your code and approve changes
7. You merge the pull request into `dev`
8. When the changes are good to go, make a pull request from `dev` to `beta`
9. Beta testers use that feature
10. Finally merge `beta` into `prod` so everyone can use it

## GitHub docker registry

In order to use the images in the [deployment repository](https://github.com/ArtFXDev/silex-deploy) using `docker-compose`, there's a GitHub action on some repositories **to build an image automatically when a tag is pushed**.

To create and push a tag, and do the following:

```shell
$ git tag v<version> # Use semantic versionning
$ git push origin <branch> --tags
```

:::tip
Make sure the tag version matches any `package.json` version.

Also use [semantic versionning](https://semver.org/) (semver).
:::

It will build the image and publish it on the GitHub Docker registry:

![](/img/docker_build.png)

Then you can **pull the latest images** to update the containers.
