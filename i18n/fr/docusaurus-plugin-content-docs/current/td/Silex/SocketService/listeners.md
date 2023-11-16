---
id: listeners
title: Listeners
sidebar_position: 40
---

Lien entre les routes et les events. Ils sont automatiquement exécutés à partir de index.js.

Donc, si vous voulez ajouter un nouvel listeners, il vous suffit de créer un nouveau fichier js sous le répertoire listener.

## Structure des Fichiers

```
📦listeners
 ┣ 📜dcc.js
 ┣ 📜index.js
 ┗ 📜ui.js
```

## Exemple de Code

```javascript
module.exports = function (io) {                                  // <== le code commence ici
  myNamespace(io).on("connection", function (socket) {            // <== dccNamespace(io)... sera exécuté par index.js
    myevent(socket)                                               // Sur l'event "connection", nous exécutons sur socket object tous les events ci-dessous
    mySecondEvent(socket, io)
    myLastEvent(socket, io)
  })
```

**Deuxième exemple d'utilisation réel :**

```javascript
/** NAMESPACE  */
const dccNamespace = require("../namespaces/dcc/dcc");
const dccActionNamespace = require("../namespaces/dcc/action");

/** EVENTS */
const initializationEvent = require("../events/dcc/initialization");
const queryEvent = require("../events/dcc/actions/query");
const requestEvent = require("../events/dcc/actions/request");
const updateEvent = require("../events/dcc/actions/update");
const diconnectEvent = require("../events/dcc/disconnect");

/** ROOMS */
const { dccRoomJoin } = require("../rooms/dcc");

module.exports = function (io) {
  dccNamespace(io).on("connection", function (socket) {
    dccRoomJoin(socket);
    initializationEvent(socket, io);
    diconnectEvent(socket, io);
  });

  dccActionNamespace(io).on("connection", function (socket) {
    queryEvent(socket, io);
    requestEvent(socket, io);
    updateEvent(socket, io);
  });
};
```
