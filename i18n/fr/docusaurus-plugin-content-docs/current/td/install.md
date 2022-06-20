---
id: install
title: Installer Silex
sidebar_position: 20
---

## Ask right on github artfxdev and account on kitsu

ArtfxDev est l'organisation qui détient les repositories Silex. Vous devez être membre de l'organisation et développeur pipeline pour obtenir les droits des applications.

Kitsu est la base de données Silex, vous avez besoin d'un compte dessus, et d'être inscrit en tant que membre du projet TEST_PIPE. Ensuite, connectez-vous à : http://kitsu.prod.Silex.artfx.fr

## Installer python and rez

Pour le pipeline 2021-2022, python 3.7.x est nécéssaire. Vous pouvez le trouver ici : https://www.python.org/downloads/windows/

Téléchargez la version source de Rez 2.95.0 depuis https://github.com/nerdvegas/rez/releases

Ouvrir un interpréteur de commande (shell) en mode admin et installer Rez avec:

```
python ./install.py -v C:/rez/__install__
```

Ajouter le chemin (path):

```
C:\rez\__install__\Scripts\rez
```

Définir une variable d'environnement REZ_CONFIG_FILE sur `\\prod.Silex.artfx.fr/rez/windows/config/rezconfig.py`

Fermez le terminal et rouvrez-le avec les droits d'administrateur. Installez les package de base avec:

```
rez bind -i C:/rez/packages --quickstart
```

## Configurer rez

Créez un dossier `packages` dans le dossier `c:/rez`. Allez dans ce dossier.

Créez un fichier nommé `.rez` dans celui-ci.

Utilisez cette commande pour cloner Silex utils (à partir de `c:/rez/packages`).

```
git clone --recurse-submodules -j8 git@github.com:ArtFXDev/Silex-rez.git
```

Ensuite, utilisez ceci pour installer les dépendances de rez pour le client de rez:

```
rez pip -i git+https://github.com/ArtFXDev/Silex_client.git
```

Allez à \\192.168.2.112\rez\windows\config, ouvrez le fichier rezconfig.py, copiez tout sauf la partie cache, collez-le dans le fichier de configuration de votre dossier d'installation rez, par exemple: C:\rez\_\_install\_\_\Lib\site-packages\rez\rezconfig.py

Fermez le terminal en administrateur et réouvrez un terminal ayant des droits normal.

Si vous avez une erreur indiquant que python n'est pas trouvé, supprimr le dossier C:\rez\packages\python, puis lancez ` rez bind -i C:/rez/packages python` avec les privilèges admin.

## Installer Silex desktop

Installer nodejs dans scoop

Pour installer scoop:

```
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
iwr -useb get.scoop.sh | iex
```

Pour installer nodejs et yarn dans scoop:

```
scoop search nodejs
scoop install nodejs-lts
scoop install yarn
```

Git repo: https://github.com/ArtFXDev/Silex-desktop

Cloner le repo:

```
git clone https://github.com/ArtFXDev/Silex-desktop
```

Créez un fichier .npmrc dan le dossier racine Silex-desktop avec ce contenu:

```
//npm.pkg.github.com/:_authToken=<YOUR_GITHUB_TOKEN>
@artfxdev:registry=https://npm.pkg.github.com/
```

Remplacez <YOUR_GITHUB_TOKEN> par votre token d'accès GitHub.
(Voir ici pour savoir où l'obtenir: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

Dans la configuration du token d'accès github, cochez repo et écrivez.

Installer les dépendances avec yarn:

```
yarn install
```

Cela installera automatiquement Silex-socket-service

## Exécuter et tester

Dans le dossier Silex desktop, exécutez Silex avec:

```
yarn start
```

Ensuite, conneztez-vous à l'application.

Vous pouvez également tester une action dans le terminal avec:

```
rez env Silex_client -- Silex action tester -c dev
```
