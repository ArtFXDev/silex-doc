Link between routes and events. They are automatically executed from index.js.

So, if you want to add a new listener, you just have to create a new js files under the listener directory.

## Files structure

```
📦listeners
 ┣ 📜dcc.js
 ┣ 📜index.js
 ┗ 📜ui.js
```

## Code Example

```javascript
module.exports = function (io) {                                  // <== the code starts here
  myNamespace(io).on("connection", function (socket) {            // <== dccNamespace(io)... will be executed by index.js
    myevent(socket)                                               // On "connection" event, we execute on socket object all below events
    mySecondEvent(socket, io)
    myLastEvent(socket, io)
  })
```

**Second example with a real usage:**

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
