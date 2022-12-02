---
id: tests
title: Tests
sidebar_position: 80
---

Le [mocha](https://mochajs.org/#hooks) est utilisé pour les test unitaires.

## Structure de Fichiers

```
📦test
 ┣ 📂dcc
 ┃ ┣ 📜action.js
 ┃ ┗ 📜dcc.js
 ┣ 📂ui
 ┃ ┗ 📜ui.js
 ┗ 📜index.js
```

La commande mocha dans package.json scanne et exécute tous les fichiers dans /test. Par conséquent, pour créer un nouveau test, il vous suffit de créer votre nouveau testfile.js sous /test.

/index.js est utilisé pour démarrer l'application principale avant tous les tests.

## Exemple de Code

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

## Utilisation

`npm run mocha `
