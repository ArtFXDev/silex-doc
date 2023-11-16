---
id: app-structure
title: Structure App
sidebar_position: 20
---

La structure d'app est assez simple.

Le point d'entrée est /index.js, il va scanner et exécuter tous les fichiers .js sous /src/listeners

```
📦src
 ┣ 📂events
 ┃ ┣ 📂dcc
 ┃ ┃ ┗ 📜yourdccevent.js
 ┃ ┗ 📂ui
 ┃ ┃ ┗ 📜youreventui.js
 ┣ 📂listeners
 ┃ ┣ 📜yourlistener.js
 ┣ 📂namespaces
 ┃ ┣ 📂dcc
 ┃ ┃ ┣ 📜yourdccnamespace.js
 ┃ ┗ 📂ui
 ┃ ┃ ┣ 📜youruinamespace.js
 ┣ 📂rooms
 ┃ ┣ 📜dcc.js
 ┃ ┗ 📜ui.js
 ┣ 📂store
 ┃ ┗ 📜index.js
 ┗ 📜index.js
```
