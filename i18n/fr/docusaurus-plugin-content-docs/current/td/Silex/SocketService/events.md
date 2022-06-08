Event are not a socket.io object, it's just custom object to structure this app.
An event contains the "real" code executed, is the main core of each behaviour.

## File structure

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

To add new event you just have to create your event.js below /events.

## Code Example

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

## Usage

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
