---
id: events
title: Events
sidebar_position: 30
---

Event n'est pas un objet socket.io, c'est juste un object personnalisé pour structurer cette application.

Un event contient le code "réel" exécuté, est le noyau principal de chaque comportement.

## Structure de fichier

```
📦events
 ┣ 📂dcc
 ┃ ┣ 📂actions
 ┃ ┃ ┣ 📜query.js
 ┃ ┃ ┣ 📜request.js
 ┃ ┃ ┗ 📜update.js
 ┃ ┣ 📜disconnect.js
 ┃ ┗ 📜initialization.js
 ┗ 📂ui
 ┃ ┣ 📜disconnect.js
 ┃ ┣ 📜getclients.js
 ┃ ┗ 📜initialization.js
```

Pour ajouter un nouvel event, il vous suffit de créer votre event.js ci-dessous /events.

## Exemple de Code

```javascript
// events/dcc/disconnect/js

const store = require("../../store"); // <== main storage of app
const { uiRoomTo } = require("../../rooms/ui"); // <== require/import here

const disconnect = (socket, io) => {
  // <== Body of your event
  socket.on("disconnect", (data) => {
    // get uuid from data
    const uuid = data.uuid;
    if (uuid && store.dccs[uuid]) {
      delete store.dccs[uuid];
    }
    uiRoomTo(io).emit("dccDisconnect", { uuid: socket.data.uuid });
  });
};
module.exports = disconnect;
```

## Utilisation

```javascript

// listeners/dcc.js

...
/** EVENTS */
const initializationEvent = require("../events/dcc/initialization")                  // <== import your event
const queryEvent = require("../events/dcc/actions/query")
const requestEvent = require("../events/dcc/actions/request")
const updateEvent = require("../events/dcc/actions/update")
const diconnectEvent = require("../events/dcc/disconnect")
...


module.exports = function (io) {
  dccNamespace(io).on("connection", function (socket) {
    dccRoomJoin(socket)                                                              // <== events arehere
    initializationEvent(socket, io)
    diconnectEvent(socket, io)
  })

  dccActionNamespace(io).on("connection", function (socket) {
    queryEvent(socket, io)                                                           // <== events are here
    requestEvent(socket, io)
    updateEvent(socket, io)
  })
}
```
