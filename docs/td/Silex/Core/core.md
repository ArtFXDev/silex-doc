---
id: core
title: Core
sidebar_position: 10
---

Silex core is responsible for the resolution and execution of actions. These actions represents what the user
can do from the context he is.

## Techologies used

Silex uses various technologies, make sure to learn about them before getting into Silex.

- Silex core is written in python. It can be used as a CLI tool or as a python library.
- Rez is used for the context management. The use of rez allows to make some actions available or not according to the resolved context.
- Silex core connects with silex-socket-service with the websocket protocol. For that, it uses the socketio library.
- The connection with the cgwire database is made possible with aiogazu, a simple python library that abstracts the HTTP routes of the database
- Actions are defined using the YAML file format

## Instalation

Silex core can be installed with pip.
```
# Simple global install
$ pip install git+https://github.com/ArtFXDev/silex_client.git

# Rez package install (require rez installed)
$ rez pip -i git+https://github.com/ArtFXDev/silex_client.git
# or simply clone the repo and place it into your rez package path manually
$ git clone https://github.com/ArtFXDev/silex_client.git
```

For production, silex should be used as a rez package (using the rez pip method or git clone method). It should be installed on a network storage with the rez configuration pointing to it.