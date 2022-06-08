---
id: event-loop
title: Event loop
sidebar_position: 50
---

Silex is running an event loop in a secondary thread. This event loop is used to run the websocket connection, and the multiple running actions.

## Problems you might encounter

- Since the silex actions and the websocket connection are running in the same event loop, if an action is holding the attention
  of the event loop for too long, the websocket connection might break. It's actually not a problem since socketio handles disonnection
  and reconnection automaticaly, but you will get a warning message in the silex UI. To prevent this, make sure to separate your action
  logic into multiple coroutines and await them.

- Some instructions might take times and are not awaitable (like system calls). To prevent this, silex has the `execute_in_thread` function.
  Using `execute_in_thread` will run the execution in a different thread and return a future with the result.

## Interaction with the DCCs

Most DCCs do not handle mutlithreading very well, plus none of them are usable with asyncio. To make all the DCCs function awaitable, we made the function
`execute_in_thread` a callable class so each DCC can customise it to work with its threading features. (see the Silex Plugins page for more infos)

For example, maya provides the method `executeDefered` and `executeInMainThreadWithResult` with both takes a callable as a parameter.

- `executeDefered` is not blocking, it's juste adding the callable to maya's own event loop without returning the result.
- `executeInMainThreadWithResult` is blocking, the call will block the event loop until the function is executed and then return the result.

In our case, we don't want to to use `executeInMainThreadWithResult`, since it is blocking, if the command takes time there is no way for the event loop
to do something else while waiting for the result, the websocket connection will break, and if other actions are running at the same time they will all be stuck.

That's why we use `executeDefered`. That way, the call is not blocking, but there is still a problem: how do we get the result ?
The `ExecutionInThread` class is actually wrapping `executeDefered` into a function that returns an asyncio future storing the result.
The future can then be awaited so the event loop will keep running on other tasks until the result is ready.

For more details, checkout the implementation done for maya (https://github.com/ArtFXDev/silex_maya/blob/dev/silex_maya/utils/thread.py)