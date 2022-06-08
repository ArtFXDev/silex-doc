For explanation about namespace usage for Socket.io see: [Socket.io/rooms](https://socket.io/docs/v4/rooms/)
Rooms are used here to split socket ui client and soccket client dcc

You can broadcast event to all client present in rooms, very usefull.

## File Structure

```
📦rooms
 ┣ 📜dcc.js
 ┗ 📜ui.js
```

To create a new room, you juste have to create .js files under /rooms directory

## Code Example

```javascript
const dccNamespace = require("../namespaces/dcc/dcc");

const dccRoomJoin = (socket) => {
  // you have 2 main function for a room : join and to
  console.log("join dccRoom"); // join need the socket client
  return socket.join("dccRoom");
};

const dccRoomTo = (io) => {
  // <== "to" need the object server : io
  return dccNamespace(io).to("dccRoom"); // <== you can bind your room to a namespace like this
};

module.exports = { dccRoomJoin, dccRoomTo }; // <== export these 2 methods
```

## Usage

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
