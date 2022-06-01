## Apps Socket Routing structure

```
📦namespaces
 ┣ /auth
 ┃ ┣ 🔧login: params: ({ email: myemail@mail.com, password: mypassword  }, callback)  # Login and set kitsuToken in store
 ┃ ┗ 🔧token: params: (callback)  # Return kitsuToken in callback
 ┣ /dcc
 ┃ ┣ 🔧disconnect: params: empty  # remove dccUuid from store
 ┃ ┗ 🔧initialization: params: (data, callback)  # data is the current context
 ┣ /dcc/action
 ┃ ┣ 🔧query: params: (data, callback) => emit data on event query on /ui
 ┃ ┣ 🔧request: params: (data, callback) => emit data on event request on /ui
 ┃ ┗ 🔧update: params: (data, callback) => emit data on event update on /ui
 ┗ /ui
   ┣ 🔧disconnect: params: empty  # remove uiUuid from store
   ┣ 🔧getclients: params: (callback) # return store.dccs
   ┣ 🔧initialization: params: (data, callback) # get uiUuid from data and save it in store
   ┗ 🔧submit: params: (data, callback) => emit data to /dcc/[dccSocketId]  # use to send reponse to dcc, dccSocketId in data params
```
