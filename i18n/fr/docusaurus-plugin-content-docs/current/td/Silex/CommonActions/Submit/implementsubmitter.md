---
title: Implement your own submitter
---

In this tutorial we'll be implementing our own submitter in Silex for the compositing software [Natron](https://natrongithub.github.io/).

Natron is an **open source compositing software** very similar to Nuke. The goal is to submit compositing scenes and output images with a write node.

## Rez package and executable

The first thing to do is to make sure that the **same version** of Natron will be used everywhere on the farm. This is useful because we don't want inconsistencies between renders.

To do that we need to add a `natron` [Rez](../../../Workflow/Rez) package.

First [download Natron's executable](https://github.com/NatronGitHub/Natron/releases/download/v2.4.3/Natron-2.4.3-Windows-x86_64.zip) for Windows. Currently the latest version is `2.4.3`.

**We will put the executable on the network** so it's not necessary to install it on every machine. It's fine since it's not that big and runs on the render farm.

Then create a package in `\\rez-network-location\silex-rez\packages\dcc`:

```
natron
├── platform-windows
│   ├── natron_env.py
│   └── Natron-2.4.3-Windows-x86_64
│       ├── bin
│       └── ...
└── package.py
```

```python title=package.py
name = "natron"
version = "2.4.3"

tools = [
    "Natron",
    "NatronRenderer"
]

variants = [
    ["platform-windows"]
]

def commands():
    import sys
    sys.path.append(root)
    import natron_env
    natron_env.commands(env, root)
```

```python title=platform-windows/natron_env.py
def commands(env, root):
    env.PATH.prepend("{root}/Natron-2.4.3-Windows-x86_64/bin")
```

:::tip
We use `env.PATH.prepend` here because we want the executable to take priority over a local installed version.
:::

:::info
`platform-windows` is an implicit package, that's why we use a variant in the package so it's resolved automatically when we say `rez env natron` on Windows. It will add to the path the executable path on the network.
:::

Now you should be able to launch Natron's GUI with:

```shell
$ rez env natron -- natron
```

## Command line usage 🖥️

Next step is to see how Natron can be used as a **command line tool** without an interface.

Check the documentation: https://natron.readthedocs.io/en/rb-2.5/devel/natronexecution.html

> Natron has 3 different execution modes:
>
> - The execution of Natron projects (.ntp)
> - The execution of Python scripts that contain commands for Natron
> - An interpreter mode where commands can be given directly to the Python interpreter

We can see that there is a special `NatronRenderer` executable that does `Natron -background` automatically. It's perfect since we want to do batch rendering on the farm.

A basic command would be:

```
$ rez env natron -- natronrenderer -w WriteNode out.####.exr 1-10 project.ntp
```

We need to specify:

- The name of the **write node** (`WriteNode`)
- The **destination path** of the rendered images (`out.####.exr`). Notice the four `#` to indicate the frame numbering like `out.0001.exr`.
- The **frame range** to render (`1-10`)
- The **scene** to render (`project.ntp`)

<hr />

With a real world example (download test file [here](/files/natron_test_project.ntp)):

![](/img/natron_test_project.png)

```
$ rez env natron -- natronrenderer -w Write1 ./out.####.exr 1-10 .\project.ntp

Restoring the image cache...
Loading plugin cache...
Info: init.py script not loaded (this is not an error)
Loading PyPlugs...
Loading project: C:/Users/etudiant/Desktop/project.ntp
Write1 ==> Rendering started
Write1 ==> Frame: 1, Progress: 10.0%, 7.4 Fps, Time Remaining: 1 seconds
Write1 ==> Frame: 3, Progress: 20.0%, 7.0 Fps, Time Remaining: 1 seconds
Write1 ==> Frame: 2, Progress: 30.0%, 10.3 Fps, Time Remaining: 0 second
Write1 ==> Frame: 4, Progress: 40.0%, 8.9 Fps, Time Remaining: 0 second
Write1 ==> Frame: 5, Progress: 50.0%, 9.9 Fps, Time Remaining: 0 second
Write1 ==> Frame: 6, Progress: 60.0%, 11.3 Fps, Time Remaining: 0 second
Write1 ==> Frame: 7, Progress: 70.0%, 9.4 Fps, Time Remaining: 0 second
Write1 ==> Frame: 8, Progress: 90.0%, 10.5 Fps, Time Remaining: 0 second
Write1 ==> Frame: 9, Progress: 90.0%, 11.8 Fps, Time Remaining: 0 second
Write1 ==> Frame: 10, Progress: 100.0%, 13.1 Fps, Time Remaining: 0 second
Write1 ==> Rendering finished
```

## Create the action ✔️

When the user clicks on the [`Submit`](../Submit) action, it launches the action defined by [`silex_client/config/action/submit.yml`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/config/action/submit.yml) which then inserts the proper submit action for the chosen software.

### Simple action

First we are going to define a new action in the `silex_client/config/submit` directory.

This is going to be a simple action without user input. We will just create tasks and give them to the command `SubmitToTractorCommand`:

```yaml title="silex_client/config/submit/natron.yml"
natron:
  label: "Submit Natron scene"
  steps:
    natron_render:
      label: "Setup render parameters"
      index: 20
      commands:
        build_natron_tasks:
          path: "silex_client.commands.farm.natron_render_tasks.NatronRenderTasksCommand"
          label: "Natron Job parameters"

        submit_to_tractor:
          label: "Submit"
          path: "silex_client.commands.farm.submit_to_tractor.SubmitToTractorCommand"
          ask_user: true
          parameters:
            tasks:
              value: !command-output "natron_render:build_natron_tasks:tasks"
            job_title:
              value: !command-output "natron_render:build_natron_tasks:file_name"
            job_tags:
              value:
                - "natron"
```

```python title="silex_client/commands/farm/natron_render_tasks.py"
from __future__ import annotations

import logging
import typing
from typing import Any, Dict

from silex_client.action.command_base import CommandBase
from silex_client.utils import farm

# Forward references
if typing.TYPE_CHECKING:
    from silex_client.action.action_query import ActionQuery


class NatronRenderTasksCommand(CommandBase):
    """
    Construct Natron render commands
    See: https://natron.readthedocs.io/en/rb-2.5/devel/natronexecution.html
    """

    @CommandBase.conform_command()
    async def __call__(
        self,
        parameters: Dict[str, Any],
        action_query: ActionQuery,
        logger: logging.Logger,
    ):
        # Use the command we used earlier with Rez
        command = r"rez env natron -- natronrenderer -w Write1 P:\test_pipe\test\render\out.####.exr 1-10 P:\test_pipe\test\project.ntp"

        # Create a farm Task by passing a list of arguments
        tasks = [farm.Task("1-10", argv=command.split(" "))]

        # Returning the results from the command
        return {"tasks": tasks, "file_name": "project.ntp"}
```

:::info
Notice that the Natron scene was put on the `P:` drive because it needs to be synchronized in order for the **computers on the farm to have access to the files**.
:::

For now we manually provide a command that will be executed in a single task on the farm. We use the [`silex_client.utils.farm.Task`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/farm.py#L21) class that directly accepts a list of arguments and will create a command.

It's equivalent to:

```python
task = farm.Task("1-10")
task.addCommand(farm.Command(argv=command.split(" ")))
tasks = [task]
```

#### Launching the job

After launching a `Submit` action (from the Maya shelf for example), press `Continue` until the action is over.

If everything goes well, go to the [Tractor dashboard](http://tractor/tv) to see the result:

![](/img/farm_test_natron.png)

Double clicking on the Task (red rectangle), you get something like this:

```s
====[2022/06/08 11:54:23 /J8451/T1/C1.2/jhenry@i7-mk8-2017-38 on md12-2021-002 ]====

Error while loading OpenGL: WGL: The driver does not appear to support OpenGL
OpenGL rendering is disabled.
WGL: The driver does not appear to support OpenGL
WGL: The driver does not appear to support OpenGL
# highlight-next-line
ERROR: Natron: P:\test_pipe\test\project.ntp: No such file.
Restoring the image cache...
Loading plugin cache...
Info: init.py script not loaded (this is not an error)
Loading PyPlugs...
```

:::danger Why is there an error?

There's an _error_ because the computer on the farm (`md12-2021-002`) **can't access files** on the `P:` drive.

Depending on the NAS where the project files are, **we need to mount a network drive pointing to that location**.

:::

#### Wrapping with the mount command

To mount the network drive, we use the following [Rez package](https://github.com/ArtFXDev/silex-rez/blob/prod/packages/utils/mount_render_drive/1.0.0/platform-windows/mount_rd.ps1):

```shell
$ rez env mount_render_drive -- mount_rd_drive ana
```

The problem is that [creating two commands on Tractor is causing issues...](../../../Renderfarm/Tractor/issues#running-multiple-commands-on-the-same-blade)

So we use a helper to wrap the command with the mount command. To do that we first need to use the [`CommandBuilder`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/command_builder.py#L5) class that uses the [builder pattern](https://doc.rust-lang.org/1.0.0/style/ownership/builders.html):

```python title="silex_client/commands/farm/natron_render_tasks.py"
# highlight-next-line
from silex_client.utils import command_builder, farm

class NatronRenderTasksCommand(CommandBase):
    """
    Construct Natron render commands
    See: https://natron.readthedocs.io/en/rb-2.5/devel/natronexecution.html
    """

    @CommandBase.conform_command()
    async def __call__(
        self,
        parameters: Dict[str, Any],
        action_query: ActionQuery,
        logger: logging.Logger,
    ):
        # highlight-start
        command = (
            command_builder.CommandBuilder(
                "natronrenderer", rez_packages=["natron"], delimiter=None
            )
            .param("w", ["Write1", r"P:\test_pipe\test\render\out.####.exr", "1-10"])
            .value(r"P:\test_pipe\test\project.ntp")
        )

        command = farm.wrap_with_mount(command, "ana")

        task = farm.Task("1-10")
        task.addCommand(command)

        return {"tasks": [task], "file_name": "project.ntp"}
        # highlight-end
```

Which results in the following command:

```shell
$ rez env cmd_wrapper -- cmd-wrapper "--pre=\"rez env mount_render_drive -- mount_rd_drive ana\"" "--cmd=\"rez env natron -- natronrenderer -w Write1 P:\\test_pipe\\test\\render\\out.####.exr 1-10 P:\\test_pipe\\test\\project.ntp\""
```

and the logs:

```
====[2022/06/08 14:10:23 /J8459/T1/C1.1/jhenry@i7-mk8-2017-38 on md7-2016-048 ]====

----------------------------- PRE COMMAND 0 BEGIN -----------------------------
DELETE *
Vous poss�dez les connexions � distance suivantes�:
    P:              \\tars\PIPELINE
La poursuite de cette op�ration va rompre les connexions.
La commande s'est termin�e correctement.
---------------------------------
NET USE P
La commande s'est termin�e correctement.
---------------------------------
net use successful
AFTER MOUNT P
Les nouvelles connexions ne seront pas m�moris�es.
�tat         Local     Distant                   R�seau
-------------------------------------------------------------------------------

OK           P:        \\ana\PIPELINE            Microsoft Windows Network

La commande s'est termin�e correctement.

----------------- PRE COMMAND 0 END in 0h 0m 1s (exit code: 0) -----------------

------------------------------ MAIN COMMAND BEGIN ------------------------------
Error while loading OpenGL: WGL: The driver does not appear to support OpenGL
OpenGL rendering is disabled.
WGL: The driver does not appear to support OpenGL
WGL: The driver does not appear to support OpenGL
Clearing the image cache...
Loading plugin cache...
Info: init.py script not loaded (this is not an error)
Loading PyPlugs...
Loading project: P:/test_pipe/test/project.ntp

Write1 ==> Rendering started
Write1 ==> Frame: 1, Progress: 10.0%, 8.0 Fps, Time Remaining: 1 seconds
Write1 ==> Frame: 2, Progress: 20.0%, 8.0 Fps, Time Remaining: 0 second
Write1 ==> Frame: 3, Progress: 30.0%, 11.3 Fps, Time Remaining: 0 second
Write1 ==> Frame: 7, Progress: 40.0%, 8.8 Fps, Time Remaining: 0 second
Write1 ==> Frame: 4, Progress: 50.0%, 10.7 Fps, Time Remaining: 0 second
Write1 ==> Frame: 6, Progress: 60.0%, 12.4 Fps, Time Remaining: 0 second
Write1 ==> Frame: 5, Progress: 70.0%, 14.5 Fps, Time Remaining: 0 second
Write1 ==> Frame: 10, Progress: 80.0%, 12.5 Fps, Time Remaining: 0 second
Write1 ==> Frame: 8, Progress: 90.0%, 13.7 Fps, Time Remaining: 0 second
Write1 ==> Frame: 9, Progress: 100.0%, 15.2 Fps, Time Remaining: 0 second
Write1 ==> Rendering finished
----------------- MAIN COMMAND END in 0h 0m 8s (exit code: 0) -----------------

====[2022/06/08 14:10:33 process complete, exit code: 0]====
```

It works!!!! 🎉🎉🎉

### Adding parameters

#### Single parameter

Now the thing is that our submitter only renders the same scene and same frames all the time... 🤔

First we need the user to select his project file in the submitter. For that we specify a `parameters` dictionnary and use the `TaskFileParameterMeta` parameter type:

```python title="silex_client/commands/farm/natron_render_tasks.py"
# highlight-next-line
from silex_client.utils.parameter_types import TaskFileParameterMeta

# Forward references
if typing.TYPE_CHECKING:
    from silex_client.action.action_query import ActionQuery


class NatronRenderTasksCommand(CommandBase):
    """
    Construct Natron render commands
    See: https://natron.readthedocs.io/en/rb-2.5/devel/natronexecution.html
    """

    # highlight-start
    parameters = {
        "scene_file": {
            "label": "Project file",
            "type": TaskFileParameterMeta(extensions=[".ntp"]),
        },
    }
    # highlight-end
```

In the interface it will show a file explorer component so the user can select his scene to submit. **It only shows `.ntp` files as specified in the parameter type**.

![](/img/natron_file_explorer.png)

Then we use that parameter in the command code:

```python title="silex_client/commands/farm/natron_render_tasks.py"
# highlight-next-line
scene_file: pathlib.Path = parameters["scene_file"]

command = (
    command_builder.CommandBuilder(
        "natronrenderer", rez_packages=["natron"], delimiter=None
    )
    .param("w", ["Write1", r"P:\test_pipe\test\render\out.####.exr", "1-10"])
    # highlight-next-line
    .value(scene_file.as_posix())
)
```

:::info
Notice that we specified the type `scene_file: pathlib.Path`. Parameters are automatically casted in their own types when given to a command.
:::

:::caution
Use [`PurePath.as_posix()`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.as_posix) method to convert any Windows path into standard POSIX path with **forward slashes**. This can cause issues on the farm when parsing the command otherwise.  
:::

#### Image output path

Now that we can provide the scene, the rendered image destination will depend on the task the same way. For that we use the [`BuildOutputPath`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/build_output_path.py#L28) command. We need to add it to the YAML action definition:

```yaml title="silex_client/config/submit/natron.yml"
natron:
  label: "Submit Natron scene"
  steps:
    # highlight-start
    build_output_path:
      label: "Build output path"
      index: 10
      commands:
        select_extension:
          label: "Output extension"
          path: "silex_client.commands.select_list.SelectList"
          parameters:
            param_name: "Output extension"
            parameters_list:
              - "exr"
              - "png"
              - "jpg"
              - "tiff"

        build_output_path:
          label: "Build output path"
          path: "silex_client.commands.build_output_path.BuildOutputPath"
          ask_user: true
          parameters:
            create_temp_dir: false
            create_output_dir: false
            output_type:
              value: !command-output "build_output_path:select_extension"
              hide: true
            use_current_context:
              value: true
              hide: true
            name:
              value: "render"
    # highlight-end

    # ...
```

It will first ask for an extension and then build the path. Use it by connecting outputs and inputs with the YAML `!command-output` directive:

```yaml title="silex_client/config/submit/natron.yml"
natron:
  steps:
    natron_render:
      commands:
        build_natron_tasks:
          # highlight-start
          ask_user: true
          parameters:
            output_directory:
              value: !command-output "build_output_path:build_output_path:directory"
            output_filename:
              value: !command-output "build_output_path:build_output_path:file_name"
            output_extension:
              value: !command-output "build_output_path:select_extension"
          # highlight-end
```

```python title="silex_client/commands/farm/natron_render_tasks.py"
class NatronRenderTasksCommand(CommandBase):
    """
    Construct Natron render commands
    See: https://natron.readthedocs.io/en/rb-2.5/devel/natronexecution.html
    """

    parameters = {
        # highlight-start
        "output_directory": {"type": pathlib.Path, "hide": True},
        "output_filename": {"type": str, "hide": True},
        "output_extension": {"type": str, "hide": True},
        # highlight-end
        "scene_file": {
            "label": "Project file",
            "type": TaskFileParameterMeta(extensions=[".ntp"]),
        },
        # highlight-next-line
        "write_node": {"type": str},
    }

    @CommandBase.conform_command()
    async def __call__(
        self,
        parameters: Dict[str, Any],
        action_query: ActionQuery,
        logger: logging.Logger,
    ):
        # highlight-start
        output_directory: pathlib.Path = parameters["output_directory"]
        output_filename: str = parameters["output_filename"]
        output_extension: str = parameters["output_extension"]
        # highlight-end

        scene_file: pathlib.Path = parameters["scene_file"]
        # highlight-start
        write_node: str = parameters["write_node"]

        output_path = (
            output_directory
            / write_node
            / f"{output_filename}_{write_node}.####.{output_extension}"
        )
        # highlight-end

        command = (
            command_builder.CommandBuilder(
                "natronrenderer", rez_packages=["natron"], delimiter=None
            )
            # highlight-next-line
            .param("w", [write_node, output_path, "1-10"])
            .value(scene_file.as_posix())
        )

        command = farm.wrap_with_mount(command, "ana")

        task = farm.Task("1-10")
        task.addCommand(command)

        # highlight-next-line
        return {"tasks": [task], "file_name": scene_file.stem}
```

Which will result in this output path (by selecting `png` for example):

```
P:\test_pipe\shots\s03\p060\layout_main\publish\v000\png\render\Write1\test_pipe_s03_p060_layout_main_publish_v000_render_Write1.####.png
```

### Frame range splitting

The last thing to do is to use the full power of a render farm: **parallelization**.

In short: spread the computation over multiple computers and make them run **simultaneously**.

To do that we need to **split the frame range** the artist wants to render, let's say `1-500` into chunks of frames. Like `10` frames on each computer.

To represent frame range expressions, we use the `FrameSet` class from the [Fileseq](https://github.com/justinfx/fileseq/) Python library. It allows representing complex range expressions like `1-10, 50-80x2` (with paddings...).

We provide a `FrameSet` parameter and a `task_size` which will define the **number of frames per task/computer**:

```python title="silex_client/commands/farm/natron_render_tasks.py"
from __future__ import annotations

import logging
import pathlib
import typing
from typing import Any, Dict, List

# highlight-next-line
from fileseq import FrameSet
from silex_client.action.command_base import CommandBase
# highlight-next-line
from silex_client.utils import command_builder, farm, frames
from silex_client.utils.parameter_types import TaskFileParameterMeta

# Forward references
if typing.TYPE_CHECKING:
    from silex_client.action.action_query import ActionQuery


class NatronRenderTasksCommand(CommandBase):
    """
    Construct Natron render commands
    See: https://natron.readthedocs.io/en/rb-2.5/devel/natronexecution.html
    """

    parameters = {
        "scene_file": {
            "label": "Project file",
            "type": TaskFileParameterMeta(extensions=[".ntp"]),
        },
        "output_directory": {"type": pathlib.Path, "hide": True},
        "output_filename": {"type": str, "hide": True},
        "output_extension": {"type": str, "hide": True},
        # highlight-start
        "frame_range": {
            "label": "Frame range",
            "type": FrameSet,
            "value": "1-50x1",
        },
        "task_size": {
            "label": "Task size",
            "tooltip": "Number of frames per computer",
            "type": int,
            "value": 10,
        },
        # highlight-end
        "write_node": {"type": str},
    }

    @CommandBase.conform_command()
    async def __call__(
        self,
        parameters: Dict[str, Any],
        action_query: ActionQuery,
        logger: logging.Logger,
    ):
        output_directory: pathlib.Path = parameters["output_directory"]
        output_filename: str = parameters["output_filename"]
        output_extension: str = parameters["output_extension"]

        scene_file: pathlib.Path = parameters["scene_file"]
        write_node: str = parameters["write_node"]
        # highlight-start
        frame_range: FrameSet = parameters["frame_range"]
        task_size: int = parameters["task_size"]
        # highlight-end

        output_path = (
            output_directory
            / write_node
            / f"{output_filename}_{write_node}.####.{output_extension}"
        )

        # highlight-start
        natron_cmd = command_builder.CommandBuilder(
            "natronrenderer", rez_packages=["natron"], delimiter=None
        )

        tasks: List[farm.Task] = []
        frame_chunks = frames.split_frameset(frame_range, task_size)

        for chunk in frame_chunks:
            # Copy the initial command
            chunk_cmd = natron_cmd.deepcopy()

            chunk_cmd.param("w", [write_node, output_path, str(chunk)])
            chunk_cmd.value(scene_file.as_posix())

            command = farm.wrap_with_mount(
                chunk_cmd, action_query.context_metadata["project_nas"]
            )

            task = farm.Task(str(chunk))
            task.addCommand(command)
            tasks.append(task)

        return {"tasks": tasks, "file_name": scene_file.stem}
        # highlight-end
```

![](/img/natron_frame_split.png)

:::tip
We use [`frames.split_frameset`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/frames.py#L16) to split a `FrameSet` expression into equal chunks.
:::

:::info
Notice that we used `action_query.context_metadata["project_nas"]` in the `wrap_with_mount` function call. **The project NAS is stored in the action context** so we use that instead of an explicit value.
:::

#### Handling frame padding

When using a frame range with a frame padding: `1-10x2` and a task size of `3` will give `["1-5x2", "7,9"]` but the issue is that **Natron doesn't understand** `-w Write1 out.###.exr 1-5x2 ...`.

Using `rez env natron -- natronrenderer -h`, we can see the syntax required:

> One or more frame ranges, separated by commas.
> Each frame range must be one of the following:
>
> - &lt;frame> (a single frame number, e.g. 57)
> - &lt;firstFrame>-&lt;lastFrame> (e.g. 10-40)
> - &lt;firstFrame>-&lt;lastFrame>:&lt;frameStep> (e.g. 1-10:2 would render 1,3,5,7,9)
>   Examples:
>   1-10:1,20-30:2,40-50
>   1329,2450,123,1-10:2

So we can easily replace any `x` character by `:` in `1-50x2` -> `1-50:2`.

```python title="silex_client/commands/farm/natron_render_tasks.py"
chunk_range = str(chunk).replace("x", ":")
chunk_cmd.param("w", [write_node, output_path, chunk_range])
```

Now it works perfectly!! 👌👌

<details><summary>Final <code>natron.yml</code> action definition file</summary>

<p>

```yml
natron:
  label: "Submit Natron scene"
  steps:
    build_output_path:
      label: "Build output path"
      index: 10
      commands:
        select_extension:
          label: "Output extension"
          path: "silex_client.commands.select_list.SelectList"
          parameters:
            param_name: "Output extension"
            parameters_list:
              - "exr"
              - "png"
              - "jpg"
              - "tiff"

        build_output_path:
          label: "Build output path"
          path: "silex_client.commands.build_output_path.BuildOutputPath"
          ask_user: true
          parameters:
            create_temp_dir: false
            create_output_dir: false
            output_type:
              value: !command-output "build_output_path:select_extension"
              hide: true
            use_current_context:
              value: true
              hide: true
            name:
              value: "render"

    natron_render:
      label: "Setup render parameters"
      index: 20
      commands:
        build_natron_tasks:
          path: "silex_client.commands.farm.natron_render_tasks.NatronRenderTasksCommand"
          label: "Natron Job parameters"
          ask_user: true
          parameters:
            output_directory:
              value: !command-output "build_output_path:build_output_path:directory"
            output_filename:
              value: !command-output "build_output_path:build_output_path:file_name"
            output_extension:
              value: !command-output "build_output_path:select_extension"

        submit_to_tractor:
          label: "Submit"
          path: "silex_client.commands.farm.submit_to_tractor.SubmitToTractorCommand"
          ask_user: true
          parameters:
            tasks:
              value: !command-output "natron_render:build_natron_tasks:tasks"
            job_title:
              value: !command-output "natron_render:build_natron_tasks:file_name"
            job_tags:
              value:
                - "natron"
```

</p>
</details>

<details><summary>Final <code>natron_render_tasks.py</code> command file</summary>

<p>

```python
from __future__ import annotations

import logging
import pathlib
import typing
from typing import Any, Dict, List

from fileseq import FrameSet
from silex_client.action.command_base import CommandBase
from silex_client.utils import command_builder, farm, frames
from silex_client.utils.parameter_types import TaskFileParameterMeta

# Forward references
if typing.TYPE_CHECKING:
    from silex_client.action.action_query import ActionQuery


class NatronRenderTasksCommand(CommandBase):
    """
    Construct Natron render commands
    See: https://natron.readthedocs.io/en/rb-2.5/devel/natronexecution.html
    """

    parameters = {
        "scene_file": {
            "label": "Project file",
            "type": TaskFileParameterMeta(extensions=[".ntp"]),
        },
        "output_directory": {"type": pathlib.Path, "hide": True},
        "output_filename": {"type": str, "hide": True},
        "output_extension": {"type": str, "hide": True},
        "frame_range": {
            "label": "Frame range",
            "type": FrameSet,
            "value": "1-50x1",
        },
        "task_size": {
            "label": "Task size",
            "tooltip": "Number of frames per computer",
            "type": int,
            "value": 10,
        },
        "write_node": {"type": str, "value": "Write1"},
    }

    @CommandBase.conform_command()
    async def __call__(
        self,
        parameters: Dict[str, Any],
        action_query: ActionQuery,
        logger: logging.Logger,
    ):
        output_directory: pathlib.Path = parameters["output_directory"]
        output_filename: str = parameters["output_filename"]
        output_extension: str = parameters["output_extension"]

        scene_file: pathlib.Path = parameters["scene_file"]
        write_node: str = parameters["write_node"]
        frame_range: FrameSet = parameters["frame_range"]
        task_size: int = parameters["task_size"]

        output_path = (
            output_directory
            / write_node
            / f"{output_filename}_{write_node}.####.{output_extension}"
        )

        natron_cmd = command_builder.CommandBuilder(
            "natronrenderer", rez_packages=["natron"], delimiter=None
        )

        tasks: List[farm.Task] = []
        frame_chunks = frames.split_frameset(frame_range, task_size)

        for chunk in frame_chunks:
            # Copy the initial command
            chunk_cmd = natron_cmd.deepcopy()

            chunk_range = str(chunk).replace("x", ":")
            chunk_cmd.param("w", [write_node, output_path, chunk_range])
            chunk_cmd.value(scene_file.as_posix())

            command = farm.wrap_with_mount(
                chunk_cmd, action_query.context_metadata["project_nas"]
            )

            task = farm.Task(str(chunk))
            task.addCommand(command)
            tasks.append(task)

        return {"tasks": tasks, "file_name": scene_file.stem}
```

</p>

</details>

## Go further 🚀

Some ideas to improve the submitter:

- Handle multiple write nodes. Use subtasks to achieve this in Tractor. See the [V-Ray submitter with render layers](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/farm/vray_render_tasks.py#L103) for a complete example.

- Once the `.ntp` project file is selected, open it in background and fill the `write_node` parameter with all the write nodes in the scene. We did that [in the Houdini submitter](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/farm/houdini_render_tasks.py#L235).

- Go through the node graph and construct a dependency graph of the write nodes and construct that for Tractor. In fact write nodes can be used as read nodes

- When a read node can't find a file, Natron will not return a return code that is different from `0`. So there's an error in the render but Tractor sees it as finished. You can either [add it into custom error messages in the blade code](https://github.com/ArtFXDev/tractor-blade-patch#bladetractorsitestatusfilterpy) or file an issue on GitHub to ask why.

  > See this thread about Natron return code: https://discuss.pixls.us/t/error-while-rendering-rendering-failed-return-code-is-0/31155
