---
id: silex-architecture
title: Architecture
sidebar_position: 5
---

![](/img/silex/silex_architecture.png)

## User space

Those parts of the Silex pipeline are available on the user machine.

### Silex desktop

Silex desktop is the main user tool. It contains the user access to most Silex services :

- File manager
- Artist DCC access and actions
- Nimby (Not In My BackYard: prevent the renderfarm from using this computer)
- Harvest film stats

It communicates both with the backend in order to execute database requests and with the Silex socket service to ensure communication with the DCC.

It is an electron application which displayed content coms from the Front server.

### Silex socket service

Silex socket service allows real time communication between Silex desktop and DCC, through Silex client actions.

### Silex client

Silex client is a configurable action system, that can launch standalone actions, usually through Rez scripts, or DCC actions thanks to plugins.

### Rez packages

Rez create specific and configurable work environments. The Rez packages are loaded to ensure the creation of this environment. When launching DCCs though Silex, artists use each time a specific Rez environment.

### Aiogazu

Aiogazu is a python library that abstracts the HTTP routes of the database. It is a fork of Gazu, that has been made asynchronous.

## Backend

### Front server (Silex front end)

This server is targeted by Silex desktop. It is a react application that contains the displayed content of Silex Desktop.

It authentificates on the CG Wire database. Most queries goes throught the GraphQL adaptor instead of attacking directly the database.

### Production tracking database

This database contains all the production data, which is used by the Silex front.

### GraphQL adaptor

GraphQL serves as an API to ease queries in a database. Queries can be configured. It is the main tool to get data from the DB.
