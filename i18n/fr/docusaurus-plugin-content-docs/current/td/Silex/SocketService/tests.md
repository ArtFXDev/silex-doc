[Mocha](https://mochajs.org/#hooks) are used tu make unit test

## Files Structure

```
📦test
 ┣ 📂dcc
 ┃ ┣ 📜action.js
 ┃ ┗ 📜dcc.js
 ┣ 📂ui
 ┃ ┗ 📜ui.js
 ┗ 📜index.js
```

Mocha command in package.json scan and execute all files in /test,
so to create a new test, you just have to create your new testfile.js under /test.

/index.js is used to start main app before all tests.

## Code Example

```javascript
const Client = require("socket.io-client"); // <== import socket.io-client lib
const assert = require("chai").assert; // <== used for assert

/** test cases */
// eslint-disable-next-line no-undef
describe("silex_socket_service_dcc", () => {
  // <== describe function is the name of your test
  let clientSocket;
  const port = 5118;

  // eslint-disable-next-line no-undef
  before((done) => {
    // <== run before your tests
    clientSocket = new Client(`http://localhost:${port}/dcc`);
    clientSocket.on("connect", () => {
      console.log("connected");
    });
    done();
  });

  // eslint-disable-next-line no-undef
  after(() => {
    // <== run after your tests
    clientSocket.close();
  });

  // eslint-disable-next-line no-undef
  it("Test dcc initialization ok", (done) => {
    // <== it function is the container four your test
    clientSocket.emit(
      "initialization",
      {
        name: "untilted",
        dcc: "undefined",
        user: "undefined",
        project: "undefined",
        asset: "undefined",
        uuid: -1,
      },
      (response) => {
        assert.equal(response.status, 200); // validate reception
        done(); // <== done() are called to validate your test
      }
    );
  });
});
```

## Usage

`npm run mocha `
