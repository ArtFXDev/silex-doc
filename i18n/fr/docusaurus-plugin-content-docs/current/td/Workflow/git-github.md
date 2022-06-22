---
id: github
title: Git & GitHub
sidebar_position: 20
---
---

Tout le code de Silex est hébergé sur GitHub dans l'organisation [ArtFXDev](https://github.com/ArtFXDev) :

![](/img/silex_repositories.png)

## Conventions

### `README.md`

Silex est censé être **open-source** donc les repositories doivent être bien présentés et propre. Nous utilisons une structure similaire pour chaque ligne de fichiers `README.md` sur [`silex-front`](https://github.com/ArtFXDev/silex-front#readme).

### Nom du repository

- Pour les package Rez, nous utilisons des underscores `_` parce qu'un trait d'union désigne une version pour Rez. (exemples: `silex_houdini`, `silex_client`)

- Pour les autres repositories c'est habituellement `silex-*` avec des traits d'union (`-`). (exemples: `silex-front`, `silex-socket-service`)

## Branches et Pull requests

Pour les repositories critiques, nous avons habituellement des branches `dev`, `beta` et `prod` branches. C'est le cas de [`silex_client`](https://github.com/ArtFXDev/silex_client).

Un développeur qui travaille sur le repository peut faire comme ceci:

```
feature-branch1 -> dev -> beta -> prod
```

1. Allez sur la branche `dev` : `git checkout dev`
2. Créer une branche de feature: `git checkout -b feature-branch1`
3. Apporter des modifications et commit: `git add ... && git commit -m "my feature"`
4. Push ces modifications sur GitHub: `git push origin feature-branch1`
5. Créer une pull request sur GitHub
6. Un autre TD review votre code et approuve les changements
7. Vous mergez la pull request en `dev`
8. Lorsque les changements sont prêts, faites une pull request de `dev` à `beta`
9. Les bêta-testeurs utilisent cette feature
10. Enfin, merge `beta` en `prod` pour que tout le monde puisse l'utiliser

## Registre des dockers GitHub

Afin d'utiliser les images dans le [deployment repository](https://github.com/ArtFXDev/silex-deploy) en utilisant `docker-compose`, il y a une action GitHub sur certains repositories **pour construire une image automatiquement lorsqu'un tag est push**.

Pour créer et push un tag, faire ce qui suit:

```shell
$ git tag v<version> # Use semantic versionning
$ git push origin <branch> --tags
```

:::tip
Assurez-vous que la version du tag correspond à n'importe quelle version de `package.json` version.

Utilisez également [semantic versionning](https://semver.org/) (semver).
:::

Il va construire l'image et la publier sur le registre GitHub Docker:

![](/img/docker_build.png)

Vous pouvez ensuite **pull les dernières images** pour mettre à jour les conteneurs.
