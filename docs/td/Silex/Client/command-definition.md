---
id: command-definition
title: Command definition
sidebar_position: 40
---

Commands are defined as python classes that inherit from [`CommandBase`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/action/command_base.py)

## Where do I place my command ?

Anywhere you want as long as it is importable by python. So to make your class importable, you must add the root folder to the `PYTHONPATH` environment variable,
just like a regular python library. However, we use a convention just for organisation purpose:

```
📦my_plugin
 ┗ 📂commands
   ┣ 📂command_category
   ┃ ┗ 📜your_command.py
   ┣ 📂command_category
   ┃ ┗ 📜your_command.py
```

## Command definition schema

The following command definition does not have type hints for simplification. In production, you should type every parameters.
All the attributes/methods overrides that are defined are optional, if you don't implement them they will just do nothing or have empty values

```python
from silex_client.action.command_base import CommandBase

class MyCommand(CommandBase):
    """
    Small description about my command
    """

    # The parameters attribute defines the list of parameters of the command
    parameters = {
        "my_parameter": {
            # The label is just for display, you can omit it, in this case the name will be used (the key if this command)
            "label": "<string> (default: value in the key)",
            # The expected value type for this parameter (see the parameter types section)
            "type": "<type> (default: NoneType)",
            # The default value for this parameter
            "value": "<any> (default: None)",
            # Little help that will be displayed on the UI
            "tooltip": "<string> || null (default: null)"
            # Specify if this parameter should be displayed on the UI
            hide: "<boolean> (default: false)"
        },
    }

    @CommandBase.conform_command()
    async def __call__(self, parameters, action_query, logger):
        # Code to run when the command will be executed

    async def undo(self, parameters, action_query, logger):
        # Code to run when the command is undo

    async def setup(self, parameters, action_query, logger):
        # Code to run every time a parameter changes
```

The three availables methods take all the same three parameters:

- parameter: A dictionnary holding the name and a **copy** of the parameter value (The fact that it is a copy is very important).
- action_query: The action query that is calling this command, you can acccess all the commands from it
- logger: Use this logger instead of the global one. This logger will store the logs into the command itself and show it to the user in the UI's debug section

The setup method, must be fast to execute, it is used for post processing user inputs or dynamically change some values according the the input. For example:

```python
async def setup(self, parameters, action_query, logger):
    task_parameter = self.command_buffer.parameters["task"]
    task_parameter.hide = parameters.["use_current_context"]
```

Here when the user will toggle the `use_current_context` parameter, the `task` parameter will hide dynamically

## Parameter types

The parameter type can be any class definition, `"type": str`, `"type": list`, `"type": int` are all valid types.
However for more complex parameters like a dropdown or a file picker you can use some special parameters found in the [parameter types module](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/parameter_types.py).

```python
from silex_client.utils.parameter_types import SelectParameterMeta

class MyCommand(CommandBase):
    parameters = {
        "my_parameter": {
            "type": SelectParameterMeta("foo", "bar", "baz")
        }
    }
```

Here we use the SelectParameterMeta, wich is a dropdown that will return a string (the selected value). These parameters are different because they
are actually functions that takes parameters.The full list won't be detailed here you can take a look at the [parameter types module](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/parameter_types.py) for the full list of special parameters types.

## Command inheritance

It is possible to inherit from an other command. It works just like normal inheritance in python exepts that the parameter will be merged
with the parameters of the children. For the method overrides, you can just use `super()` like in normal python inheritance.
