---
id: getting-started
title: Getting started
sidebar_position: 20
---

This guide will walk you through the installation of Silex for a new developer.

This means being able to **contribute** and **implement new features**.

:::info
This guide is assuming that you are working in a **Windows environment**.
:::

## Prerequisites

- Be part of the [ArtFXDev](https://github.com/ArtFXDev) Github organization
- The backend services are running either on a shared server or [locally](./Backend) (`zou`, `silex-front`)
- Have an account on the pipeline database (Zou) by going to http://kitsu.prod.silex.artfx.fr

## Install Scoop

We will start by installing [Scoop](https://scoop.sh/), a package manager that can easily install, remove and update software **without breaking stuff**.

From a PowerShell terminal, run:

```powershell
$ Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
$ irm get.scoop.sh | iex
$ scoop --version
```

## Install Python and Rez

If not already, you can install **git** with Scoop (you will need it for the next steps):

```shell
$ scoop install git
```

### Python

As for the 2021-2022 pipeline, Python **3.7.x** is needed. See the [VFX Reference Platform](http://vfxplatform.com/) for the Windows Python version target.

Install it with Scoop:

```shell
$ scoop bucket add versions # Add versions bucket
$ scoop install python37
$ scoop reset python37 # Make sure shims are created
$ python --version
```

### Rez

Rez is the package environment resolver, to install it clone it from GitHub:

```shell
$ git clone https://github.com/AcademySoftwareFoundation/rez
$ cd rez
$ python ./getting-started.py -v C:/rez/__install__ # -v specify the installation directory
```

Then add that path to the `$PATH` environment variable so the executable is recognized:

```
C:\rez\__install__\Scripts\rez
```

Launch a new terminal and you should be able to run Rez:

```shell
$ rez --version
# Rez 2.111.1 from c:\rez\__install__\lib\site-packages\rez (python 3.7)
```

Rez needs a configuration file, since we want it to be on the network, tell Rez where to find it by creating a `REZ_CONFIG_FILE` pointing to: `\\prod.silex.artfx.fr/rez/windows/config/rezconfig.py` (change it with the real location).

It should change the way packages are searched on the network:

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
The above paths might change depending on the network configuration and the `rezconfig.py` paths.
:::

## Configure Rez

The `rezconfig.py` configuration file describes the location where Rez should find packages.

In the current configuration, these are the main locations:

```python
root_packages_path = [
    r"D:\rez\dev_packages", # For your own Silex dev packages
    r"C:\rez\packages", # For local production packages
    r"\\prod.silex.artfx.fr\rez\packages", # Network packages
]
```

:::tip
When Rez resolves a package, packages have priority over others depending of the order of the `root_packages_path`. So dev packages are first.
:::

### Basic packages: `silex-rez`

First clone the [`silex-rez`](https://github.com/ArtFXDev/silex-rez) repository to get basic packages:

```powershell
$ mkdir D:\rez\dev_packages
$ cd D:\rez\dev_packages
$ New-Item -ItemType File -Name .rez # Tell Rez to search in this directory
$ git clone --recurse-submodules -j8 git@github.com:ArtFXDev/silex-rez.git # Clone recursively
```

Now resolving `houdini` as a package should use the local version:

```shell
$ rez env houdini

# resolved packages:
# houdini-18.5.596  d:\rez\dev_packages\silex-rez\packages\dcc\houdini\18.5.596\platform-windows
# platform-windows  c:\rez\packages\lib\platform\windows
```

### Dev setup for `silex_client`

In order to develop locally and use your own packages, do the following:

```shell
$ cd D:\rez\dev_packages
$ mkdir silex; cd silex
$ New-Item -ItemType File -Name .rez
$ mkdir silex_client; cd silex_client
$ git clone git@github.com:ArtFXDev/silex_client.git dev.1.0.0
```

This will clone a local version of `silex_client` in a `dev` version folder so you should have this structure:

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

And now Rez should resolve your local package:

```shell
$ rez env silex_client-dev

# ...
# silex_client-dev.1.0.0      d:\rez\dev_packages\silex\silex_client\dev.1.0.0
# ...
```

## Install `silex-desktop`

`silex-desktop` is the desktop application using Electron. It uses JavaScript.

Install Node.JS using scoop:

```shell
$ scoop install nodejs-lts
$ npm install --global yarn # Install the Yarn package manager
```

Then clone `silex-desktop` repository:

```shell
$ git clone git@github.com:ArtFXDev/silex-desktop.git
```

Since `silex-desktop` uses [`silex-socket-service`](https://github.com/ArtFXDev/silex-socket-service) as a direct dependency and it's hosted on GitHub's NPM registry, you need a personal access token to fetch it.

Create a `.npmrc` file in the `silex-desktop` root folder with that content:

```text title="silex-desktop/.npmrc"
//npm.pkg.github.com/:_authToken=<YOUR_GITHUB_TOKEN>
@artfxdev:registry=https://npm.pkg.github.com/
```

Replace `<YOUR_GITHUB_TOKEN>` with your GitHub access token.
(See [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for instructions.)

Finally install the dependencies with Yarn:

```shell
$ yarn install
```

## Run and test

1. Launch the desktop application:

```shell
$ cd silex-desktop
$ yarn start
```

2. Then login with your Silex account.

3. Launch the `tester` action from another terminal:

```shell
$ rez env silex_client-dev -- silex action tester -c dev
```

> Congratulations you are now ready to contribute to Silex! 🎉🎉
