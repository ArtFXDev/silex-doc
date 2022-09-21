The app structure is pretty simple.

Entry point is /index.js, it will scan and execute all .js files under /src/listeners

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
