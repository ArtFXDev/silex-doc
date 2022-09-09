---
id: client
title: Client
sidebar_position: 20
---

Silex client is responsible for the resolution and execution of actions. These actions represents what the user
can do from the context he or she is in.

## Technologies used

Silex uses various technologies, make sure to learn about them before getting into Silex.

- Silex core is written in [python](https://www.python.org/). It can be used as a CLI tool or as a Python library.
- [Rez](https://github.com/AcademySoftwareFoundation/rez) is used for the context management. The use of rez allows to make some actions available or not according to the resolved context.
- Silex client connects with [silex-socket-service](https://github.com/ArtFXDev/silex-socket-service) with the WebSocket protocol. For that, it uses the [python-socketio](https://python-socketio.readthedocs.io/en/latest/index.html) library.
- The connection with the [CGWire](https://www.cg-wire.com/) database is made possible with [aiogazu](https://github.com/ArtFXDev/aiogazu), a simple python library that abstracts the HTTP queries of the backend.
- Actions are defined using the [YAML](https://fr.wikipedia.org/wiki/YAML) file format.

## Installation

Silex client can be installed with pip.

```bash
# Simple global install
$ pip install git+https://github.com/ArtFXDev/silex_client.git

# Rez package install (require rez installed)
$ rez pip -i git+https://github.com/ArtFXDev/silex_client.git
# or simply clone the repo and place it into your rez package path manually
$ git clone https://github.com/ArtFXDev/silex_client.git
```

:::caution
For production, `silex_client` should be used as a rez package (using the rez pip method or git clone method). It should be installed on a network storage with the rez configuration pointing to it.
:::
