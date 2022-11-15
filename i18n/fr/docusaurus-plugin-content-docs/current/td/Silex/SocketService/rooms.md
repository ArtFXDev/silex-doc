---
id: rooms
title: Rooms
sidebar_position: 60
---

Pour des explication sur l'utilisation des namespace pour Socket.io voir : [Socket.io/rooms](https://socket.io/docs/v4/rooms/)

Les rooms sont utilisées ici pour diviser les socket d'interface client et les socket DCC client.

Vous pouvez diffuser l'event à tous les clients présents dans les rooms, ce qui est très utile.

## Structure de Fichier

```
📦rooms
 ┣ 📜dcc.js
 ┗ 📜ui.js
```

Pour créer une nouvelle room, il vous suffit de créer des fichers .js sous le répertoire /rooms

## Exemple de Code

```javascript
const dccNamespace = require("../namespaces/dcc/dcc");

const dccRoomJoin = (socket) => {
  // vous avez 2 fonction principale pour une room : join et to
  console.log("join dccRoom"); // join need the socket client
  return socket.join("dccRoom");
};

const dccRoomTo = (io) => {
  // <== "to" need the object server : io
  return dccNamespace(io).to("dccRoom"); // <== vous pouvez lier votre room à un namespace comme ceci
};

module.exports = { dccRoomJoin, dccRoomTo }; // <== exporter ces 2 méthodes
```

## Utilisation

```javascript
// listeners/dcc.js
...
/** ROOMS */
const { dccRoomJoin } = require("../rooms/dcc")                 // <== room are import here

module.exports = function (io) {
  dccNamespace(io).on("connection", function (socket) {
    dccRoomJoin(socket)                                        // <== join are called here
    initializationEvent(socket, io)
    diconnectEvent(socket, io)                                 // code of this below ...
  })


// events/dcc/disconnect.js
const store = require("../../store")
const { uiRoomTo } = require("../../rooms/ui")                          // <== To are import here

const disconnect = (socket, io) => {
  socket.on("disconnect", (data) => {
    // get uuid from data
    const uuid = data.uuid
    if (uuid && store.dccs[uuid]) {
      delete store.dccs[uuid]
    }
    uiRoomTo(io).emit("dccDisconnect", { uuid: socket.data.uuid })      // <== to emit on all socket client in the namespaces+rooms
  })
}
module.exports = disconnect

```
