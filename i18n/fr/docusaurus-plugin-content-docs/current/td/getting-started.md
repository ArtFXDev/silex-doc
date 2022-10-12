---
id: getting-started
title: Mise en route
sidebar_position: 20
---

Ce guide vous guidera dans l'installation de Silex en étant un nouveau développeur.

Cela signifie être en mesure de **contribuer** et de mettre ne œuvre de **nouvelles fonctionnalités**.

:::info
Ce guide suppose que vous travaillez dans un **environnement Windows**.
:::

## Prérequis

- Faire partie de l'organisation [ArtFXDev](https://github.com/ArtFXDev) Github
- Les services backend fonctionnent soit sur un serveur partagé soit [localement](./Backend) (`zou`, `silex-front`)
- Avoir un compte sur la base pipeline (Zou) en allant sur http://kitsu.prod.silex.artfx.fr

## Installer Scoop

Nous allons commencer par installer [Scoop](https://scoop.sh/), un gestionnaire de paquets qui peut facilement installer, supprimer et mettre à jour le logiciel **sans casser les choses**.

À partir d'un terminal PowerShell terminal, exécuter :

```powershell
$ Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
$ irm get.scoop.sh | iex
$ scoop --version
```

## Installer Python et Rez

Si ce n'est pas déjà fait, vous pouvez installer **git** avec Scoop (vous en aurez besoin pour les prochaines étapes):

```shell
$ scoop install git
```

### Python

En ce qui concerne le pipeline 2021-2022, Python **3.7.x** est nécessaire. Voir [VFX Reference Platform](http://vfxplatform.com/) pour la version Windows Python.

Installez-le avec Scoop:

```shell
$ scoop bucket add versions # Ajout version bucket
$ scoop install python37
$ scoop reset python37 # Vérfier que les shims sont créées
$ python --version
```

### Rez

Rez est le résolveur d'environnement de paquet, pour l'installer cloner le GitHub:

```shell
$ git clone https://github.com/AcademySoftwareFoundation/rez
$ cd rez
$ python ./install.py -v C:/rez/__install__ # spécifie le répertoire d'installation, -v : verbose
```

Ajoutez ensuite ce chemin à la variable d'environnement `$PATH` afin que l'exécutable soit reconnu :

```
C:\rez\__install__\Scripts\rez
```

Lancez un nouveau terminal et vous devriez pouvoir exécuter Rez:

```shell
$ rez --version
# Rez 2.111.1 from c:\rez\__install__\lib\site-packages\rez (python 3.7)
```

Rez a besoin d'un fichier de configuration, puisque nous voulons qu'il soit sur le réseau, dites à Rez où le trouver en créant un `REZ_CONFIG_FILE` pointant vers : `\\prod.silex.artfx.fr/rez/windows/config/rezconfig.py` (changez-le avec l'emplacement réel).

Il devrait changer la façon dont les paquets sont recherchés sur le réseau :

```shell
$ rez config packages_path
# - D:\rez\dev_packages
# - C:\rez\packages
# - C:\rez\packages\lib
# - C:\rez\packages\silex
# - \\192.168.2.112\rez\packages
# - \\192.168.2.112\rez\packages\lib
# - \\192.168.2.112\rez\packages\plugins
# - \\192.168.2.112\rez\packages\silex-rez
# - \\192.168.2.112\rez\packages\silex-rez\packages
# - \\192.168.2.112\rez\packages\silex-rez\packages\5rn
# - \\192.168.2.112\rez\packages\silex-rez\packages\dcc
# - \\192.168.2.112\rez\packages\silex-rez\packages\projects
# - \\192.168.2.112\rez\packages\silex-rez\packages\silex
# - \\192.168.2.112\rez\packages\silex-rez\packages\softwares
# - \\192.168.2.112\rez\packages\silex-rez\packages\tools
# - \\192.168.2.112\rez\packages\silex-rez\packages\utils
# - \\192.168.2.112\rez\packages\tools

$ rez config local_packages_path
# C:\rez\packages
```

:::caution
Les chemins ci-dessus peuvent changer en fonction de la configuration du réseau et des chemins `rezconfig.py`.
:::

## Configurer Rez

Le fichier de configuration `rezconfig.py` décrit l'emplacement où Rez doit trouver les packages.

Dans la configuration actuelle, voici les principaux emplacements :

```python
root_packages_path = [
    r"D:\rez\dev_packages", # Pour vos propres packages Silex dev
    r"C:\rez\packages", # Pour les packages de production locale
    r"\\prod.silex.artfx.fr\rez\packages", # Package réseau
]
```

:::tip
Lorsque Rez résout un package, les packages ont la priorité sur les autres en fonction de l'ordre du `root_packages_path`. Les packages dev sont donc les premiers.
:::

### Packages de base : `silex-rez`

Clonez d'abord le dépôt [`silex-rez`](https://github.com/ArtFXDev/silex-rez) pour obtenir les packages de base :

```powershell
$ mkdir D:\rez\dev_packages
$ cd D:\rez\dev_packages
$ New-Item -ItemType File -Name .rez # Dites à Rez de chercher dans ce répertoire
$ git clone --recurse-submodules -j8 git@github.com:ArtFXDev/silex-rez.git # Cloner récursivement
```

Maintenant, la résolution de `houdini` en tant que package devrait utiliser la version locale:

```shell
$ rez env houdini

# resolved packages:
# houdini-18.5.596  d:\rez\dev_packages\silex-rez\packages\dcc\houdini\18.5.596\platform-windows
# platform-windows  c:\rez\packages\lib\platform\windows
```

### Configuration de développement pour `silex_client`

Pour développer localement et utiliser vos propres packages, procédez comme suit :

```shell
$ cd D:\rez\dev_packages
$ mkdir silex; cd silex
$ New-Item -ItemType File -Name .rez
$ mkdir silex_client; cd silex_client
$ git clone git@github.com:ArtFXDev/silex_client.git dev.1.0.0
```

Cela clonera une version locale de `silex_client` dans un dossier de version `dev`, de sorte que vous devriez avoir cette structure :

```
.
├── .rez
├── silex
│   ├── .rez
│   └── silex_client
│       └── dev.1.0.0
│           └── ...
└── silex-rez
    └── ...
```

Et maintenant Rez devrait résoudre vos packages local :

```shell
$ rez env silex_client-dev

# ...
# silex_client-dev.1.0.0      d:\rez\dev_packages\silex\silex_client\dev.1.0.0
# ...
```

## Installer `silex-desktop`

`silex-desktop` est l'application de bureau qui utilise Electron. Elle utilise JavaScript.

Installer Node.JS en utilisant scoop:

```shell
$ scoop install nodejs-lts
$ npm install --global yarn # Installer le gestionnaire de package Yarn
```

Puis cloner le repository `silex-desktop` :

```shell
$ git clone git@github.com:ArtFXDev/silex-desktop.git
```

Puisque `silex-desktop` utilise [`silex-socket-service`](https://github.com/ArtFXDev/silex-socket-service) comme dépendance directe et qu'il héberge dans le registre NPM de GitHub, vous avez besoin d'un token d'accès personnel pour le récupérer.

Créer un fichier `.npmrc` dans le dossier racine `silex-desktop` avec ce contenu :

```text title="silex-desktop/.npmrc"
//npm.pkg.github.com/:_authToken=<YOUR_GITHUB_TOKEN>
@artfxdev:registry=https://npm.pkg.github.com/
```

Remplacez `<YOUR_GITHUB_TOKEN>` par votre token d'accès GitHub.
(Voir [ici](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) pour obtenir des instructions.)

Enfin installer les dépendances avec Yarn:

```shell
$ yarn install
```

## Exécuter and tester

1. Lancer l'application de bureau:

```shell
$ cd silex-desktop
$ yarn start
```

2. Ensuite, connectez-vous avec votre compte Silex.

3. Lancer l'action `tester` depuis un autre terminal :

```shell
$ rez env silex_client-dev -- silex action tester -c dev
```

> Félicitation vous êtes maintenant prêt à contribuer à Silex! 🎉🎉
