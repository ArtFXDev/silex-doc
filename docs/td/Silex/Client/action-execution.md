---
id: action-execution
title: Action execution
sidebar_position: 20
---

An action is a set of instructions that will be executed sequentially. To learn more about them, read the user guide page about actions.

## Executing actions from CLI

#### Execution

This is the simplest way of executing an action. Once silex is installed, run `silex action <action-name>`.
If you installed silex core as a rez package, don't forget to execute this command in the rez environment: `rez env silex_client -- silex action <action-name>`

#### Task ID

Some action behaves differently according to the [context](./context.md) you are executing them from (for example, the publish will set the publish location using the current task defined in the context).
You can specify the task using the `--task-id` argument with the ID if the entity in the cgwire database.

#### Parameters

Silex actions sometimes prompt the user with parameters. You can set parameters ahead with the `--parameters` argument. The expected value is `<parameter-path>=<parameter-value>` the parameter will be automaticaly casted into the expected parameter type. To set multiple parameters just use this argument multiple times.

#### Batch mode

Sometimes you want to execute actions in headless mode (on the renderfarm or on ssh), in this case you don't have access to the silex UI and when the user will be prompted, the action execution will be stuck waiting for an input in the UI. To prevent that you can use `--batch` to tell silex to not try to connect to the UI via websocket. All the parameters that require a user input will keep their default values.

#### Categories

If your action is not in the default category (the `actions` category) you can specify a different one by using the `--category` argument (for more information see the action definition page)

:::tip
To get more information about the silex client CLI, use `silex action --help`
:::

## Executing actions from Python

When executing an action from a dcc (with a shelf button) you wan to execute the action from python:

```python
from silex_client.action.action_query import ActionQuery

action = ActionQuery("<action-name>")
action.execute()
```

#### Categories

If your action is not in the default category (the `actions` category) you can specify a different one by using the `category` parameter when instanciating the
action (for more informations see the action definition page)

#### Methods

Executing an action from python is mutch more flexible because the ActionQuery object gives you control on the execution at runtime.
Here is a list of usefull methods on the ActionQuery, they can be used while the action is executing.

```python
# Some of the following methods have an async version (prefixed with 'async_')
# use those if you want to use them from the silex event loop.
# (see the event loop page)

# Set a parameter
action.set_parameter("<parameter-path>", <value>)

# Get a command
action.get_command("<command-path>")

# Stop the execution if executing and go back one command
action.undo()

# Pause the execution
action.stop()

# Resume the execution
action.redo()

# Synchronize with the UI, use this method if you modified
# the buffer of the action directly (like get a command and modify its data)
action.update_websocket()
```

## Debugging an action

When an execution is not going right, you can debug its execution using some action query methods. The following instructions cannot be used for actions executed from the CLI.

- Make sure to set the log level to `INFO`, the default is `WARNING`

```python
from silex_client.utils.log import logger
logger.setLevel("INFO")
```

:::caution
`DEBUG` is very verbose (it logs every diffs of the websocket synchronisation process) so `INFO` is enough most of the time
:::

- If you didn't store the ActionQuery instance into a variable (or the action was started from a shelf button) you can get the ActionQuery instance with its ID from the Context:

```python
# To get the ID, click on the button next to the context in
# the panel of the action on the UI. It will store the ID in you clipboard.
from silex_client.core.context import Context
action = Context.get().actions["<action-id>"]
```

- You can use the execute method with the step_by_step argument (`action.execute(step_by_step=True)`). This will execute only one command and pause directly. From that point it will be easier check all the values of the output and inputs. To go to the next command, use `action.execute(step_by_step=True)` again.

- Some commands / parameters are hidden, you might want to set them to visible, here is a snippet to set every commands:

```python
for command in action.commands:
    commands.hide = False

# Always use this method after modifying the buffers directly, to keep synced with the UI
action.update_websocket()
```

- You can check the output of a command at any time, with the `output_result` property.

```python
print(action.command[<command-index>].output_result)
```

- You can check the input of a parameter at any time with the get_value method. Parameter input can be a link to a command output. This method will resolve all the links if any and give you the real value directly.

```python
print(action.command[<command-index>].parameters["<parameter-name>"].get_value(action))
```
