---
id: install
title: Installer Silex
sidebar_position: 20
---

# Ask right on github artfxdev and account on kitsu

ArtfxDev est l'organisation qui détient les repositories Silex . Vous devez être membre de l'organisation et développeur pipeline pour obtenir les droits des applications.

Kitsu est la bade de données Silex, vous avez avoir un compte, et être inscrit comme membre du projet TEST_PIPE. Connectez-vous ensuite à : http://kitsu.prod.Silex.artfx.fr

# Installer python et rez

For 2021-2022 pipeline, python 3.7.x is needed. You can find it here : https://www.python.org/downloads/windows/

Download Rez 2.95.0 source release from https://github.com/nerdvegas/rez/releases

Open a shell in admin mode and install Rez with:

```
python ./install.py -v C:/rez/__install__
```

Add to path:

```
C:\rez\__install__\Scripts\rez
```

Set a REZ_CONFIG_FILE environment variable to `\\prod.Silex.artfx.fr/rez/windows/config/rezconfig.py`

Close terminal and reopen it still with admin rights. Install basic packages with:

```
rez bind -i C:/rez/packages --quickstart
```

# Configure rez

Create a `packages` folder in the `c:/rez` folder. Go into this folder.

Create a file named `.rez` in it.

Use this command to clone Silex utils (from `c:/rez/packages`).

```
git clone --recurse-submodules -j8 git@github.com:ArtFXDev/Silex-rez.git
```

Then use this to install rez dependancies for rez client:

```
rez pip -i git+https://github.com/ArtFXDev/Silex_client.git
```

Go to \\192.168.2.112\rez\windows\config, open the rezconfig.py, copy everything except the caching part, paste it in the config file in your rez installation folder, for instance: C:\rez\_\_install\_\_\Lib\site-packages\rez\rezconfig.py

Close the admin terminal and reopen a normal rights terminal.

If you have an error saying python is not found, remove the C:\rez\packages\python folder, then launch ` rez bind -i C:/rez/packages python` with admin priviledges.

# Install Silex desktop

Install nodejs through scoop

To install scoop:

```
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
iwr -useb get.scoop.sh | iex
```

To install nodejs and yarn through scoop:

```
scoop search nodejs
scoop install nodejs-lts
scoop install yarn
```

Git repo: https://github.com/ArtFXDev/Silex-desktop

Clone the repo:

```
git clone https://github.com/ArtFXDev/Silex-desktop
```

Create a .npmrc file in the Silex-desktop root folder with that content:

```
//npm.pkg.github.com/:_authToken=<YOUR_GITHUB_TOKEN>
@artfxdev:registry=https://npm.pkg.github.com/
```

Replace <YOUR_GITHUB_TOKEN> with your GitHub access token.
(See here for where to get it: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token .)

In the github access token config, tick repo and write.

Install dependencies with yarn:

```
yarn install
```

This will automatically install Silex-socket-service

# Run and test

In the Silex desktop folder, run Silex with:

```
yarn start
```

Then connect to the app.

You can also test an action in the terminal with:

```
rez env Silex_client -- Silex action tester -c dev
```