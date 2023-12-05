## Example of Usage

Example of usage of Silex Socket Service in Silex-front.

Create a Socket-io connection with Socket-io (on 5118 by default for silex socket service)

First of all, in the Socket-io connection you need to put the right namespace you want to use like this.

```js
export const socketInstance = io(
  "http://localhost:5118/ui", // <== pass the namespace here
  { reconnectionDelay: 2000 }
);
```

For example if you want to send the event 'clearAction' on SilexSocketService:

```js
// Cancel or clear the action
const handleClearAction = () => {
  socketInstance.emit("clearAction", { uuid: action.uuid }, () => {
    // then here
  });
};
```
