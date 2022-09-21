For explanations about namespace usage for Socket.io see: [Socket.io/namespaces](https://socket.io/docs/v4/namespaces/)

Simply put : Namespaces are like a route for your request, to sort them.

## Files Structure

```
📦namespaces
 ┣ 📂dcc
 ┃ ┣ 📜action.js
 ┃ ┗ 📜dcc.js
 ┗ 📂ui
 ┃ ┣ 📜action.js
 ┃ ┗ 📜ui.js
```

To add a new namespace you have to create a .js file under the namespaces directory of the project. In the file structure example, we have 4 namespaces:

- /dcc
- /dcc/action
- /ui
- /ui/action

## Code example

```javascript
const ui = (io) => {
  return io.of("/ui");
};

module.exports = ui;
```

this will simply return the output object of io.of("/ui")

## Usage:

```javascript
// listeners/dcc.js

/** NAMEPSACE  */
const dccNamespace = require("../namespaces/dcc/dcc")              // <== Import Here
const dccActionNamespace = require("../namespaces/dcc/action")


module.exports = function (io) {
  dccNamespace(io).on("connection", function (socket) {            // <== Use Here
    dccRoomJoin(socket)
    ...
```

**Client side for Namespace connection**:
clientDcc = new Client(`http://localhost:${port}/dcc`)
