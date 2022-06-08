---
id: context
title: Context
sidebar_position: 10
---

Silex is context sensitive, the all point of actions is that the same action will depend of where you are executing it from. The context is defined by two factors :

- The rez environment , wich will define the available actions and commands.
- The task ID, wich will define the variables stored in the context metadata like project name, task name, user name, shot name...

## The rez environment

Silex can load plugins dynamically thanks to rez. Each plugins will register a list of actions and commands. The order is important because registed actions can override and inherit from child actions.

## The task ID

You can access various informations about the current context with the globally instanciated `Context` class. This class behaves like a readonly dict that gives you access to all these informations.

```python
from silex client.core.context import Context

print(Context.get()["task"])
```

If you want to recompute all the metadata you can use the `compute_metadata()` method. You can set the `SILEX_TASK_ID` environment variable before if you want to recompute the metadata for a different context. (This is wat the set-context action does)

These metadata are used accross a lot of actions to adapt according to the current scene.
