---
id: usage
title: Usage
sidebar_position: 90
---

## Exemple d'Utilisation

Exemple d'utilisation de Silex Socket Service dans Silex-front.

Créer une connexion Socket-io avec Socket-io (sur 5118 par défaut pour le service silex socket)

Tout d'abord, dans la connexion Socket-io, vous devez mettre le bon namespace que vous voulez utiliser comme ceci.

```js
export const socketInstance = io(
  "http://localhost:5118/ui", // <== pass the namespace here
  { reconnectionDelay: 2000 }
);
```

Par exemple si vous voulez envoyer l'event 'clearAction' sur SilexSocketService :

```js
// Cancel or clear the action
const handleClearAction = () => {
  socketInstance.emit("clearAction", { uuid: action.uuid }, () => {
    // then here
  });
};
```
