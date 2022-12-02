---
id: namespace
title: Namespace
sidebar_position: 50
---

Pour des explication sur l'utilisation des namespace pour Socket.io voir : [Socket.io/namespaces](https://socket.io/docs/v4/namespaces/)

De manière simple : Namespaces est comme une route pour votre requête, pour les trier.

## Structure des Fichiers

```
📦namespaces
 ┣ 📂dcc
 ┃ ┣ 📜action.js
 ┃ ┗ 📜dcc.js
 ┗ 📂ui
 ┃ ┣ 📜action.js
 ┃ ┗ 📜ui.js
```

Pour ajouter de nouveaux namespaces, vous devez créer un fichier .js sous le répertoire namespaces du projet. Dans l'exemple de structure de fichier, nous avons 4 namespaces :

- /dcc
- /dcc/action
- /ui
- /ui/action

## Exemple de Code

```javascript
const ui = (io) => {
  return io.of("/ui");
};

module.exports = ui;
```

Cela retournera simplement l'objet de sortie de io.of("/ui")

## Utilisation :

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

**Côté client pour la connexion au Namespace**:
clientDcc = new Client(`http://localhost:${port}/dcc`)
