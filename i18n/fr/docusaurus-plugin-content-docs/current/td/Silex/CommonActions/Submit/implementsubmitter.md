---
title: Implémenter notre propre submitter
---

Dans ce tutoriel, nous allons implémenter notre propre submitter dans Silex pour le logiciel de composition [Natron](https://natrongithub.github.io/).

Natron est un **logiciel de compositing open source** très similaire à Nuke. Le but est de submit des scène de compositing et des images de sortie avec un node d'écriture.

## Paquet Rez et exécutable

La première chose à faire est de s'assurer que la **même version** de Natron sera utilisée partout sur la farm. Ceci est utile car nous ne voulons pas d'incohérences entre les rendus.

Pour ce faire, nous devons ajouter un paquet `natron` [Rez](../../../Workflow/Rez).

[Téléchargez d'abord l'exécutable de Natron](https://github.com/NatronGitHub/Natron/releases/download/v2.4.3/Natron-2.4.3-Windows-x86_64.zip) pour Windows. Actuellement, la dernière version est `2.4.3`.

**Nous mettrons l'exécutable dans le réseau** afin qu'il nesoit pas nécessaire de l'installer sur chaque machine. C'est bien puisqu'il n'est pas si grand et fonctionne sur la render farm.

Puis créer un package dans `\\rez-network-location\silex-rez\packages\dcc`:

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
Nous utilisons `env.PATH.prepend` ici parce que nous voulons que l'exécutable ait priorité sur une version installée localement.
:::

:::info
`platform-windows` est un package implicite, c'est pourquoi nous utilisons une variante dans le package afin qu'il soit résolu automatiquement lorsque nous disons `rez env natron` sur Windows. Il ajoutera au chemin le chemin exécutable sur le réseau.
:::

Vous devriez maintenant pouvoir lancer l'interface graphique de Natron avec :

```shell
$ rez env natron -- natron
```

## Utilisation de la ligne de commande 🖥️

La prochaine étape consiste à voir comment Natron peut-être utilisé comme **outil de ligne de commande** sans interface.

Consultez la documentation : https://natron.readthedocs.io/en/rb-2.5/devel/natronexecution.html

> Natron dispose de 3 modes d'exécution différents :
>
> - L'exécution des projets Natron (.ntp)
> - L'exécution de scripts Python contenant des commandes pour Natron
> - Une mode interpréteur où les commandes peuvent être données directement à l'interpréteur Python

Nous pouvons voir qu'il y a un exécutable spécial `NatronRenderer` qui fait automatiquement `Natron -background`. C'est parfait puisqu'on veut faire du batch rendering sur la farm.

Une commande de base serait :

```
$ rez env natron -- natronrenderer -w WriteNode out.####.exr 1-10 project.ntp
```

Nous devons préciser :

- Le nom du **node d'écriture** (`WriteNode`)
- Le **chemin de destination** des images rendues (`out.####.exr`). Remarquez les quatre `#` pour indiquer la numérotation des frames comme `out.0001.exr`.
- La **plage de frames** à rendre (`1-10`)
- La **scène** à rendre (`project.ntp`)

<hr />

Avec un exemple réel (télécharger le fichier de test [ici](/files/natron_test_project.ntp)):

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

## Création de l'action ✔️

Lorsque l'utilisateur clique sur l'action [`Submit`](../Submit), il lance l'action définie par [`silex_client/config/action/submit.yml`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/config/action/submit.yml) qui insère ensuite l'action de submit appropriée pour le logiciel choisi.

### Action simple

Nous allons d'abord définir une nouvelle action dans le répertoire `silex_client/config/submit`.

Cela va être une action simple sans entrée de l'utilisateur. Nous allons juste créer des tasks et les donner à la commande `SubmitToTractorCommand` :

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
        # Utilisez la commande utilisée précédemment avec Rez
        command = r"rez env natron -- natronrenderer -w Write1 P:\test_pipe\test\render\out.####.exr 1-10 P:\test_pipe\test\project.ntp"

        # Créer une Task de farm en passant une liste d'arguments
        tasks = [farm.Task("1-10", argv=command.split(" "))]

        # Renvoyer les résultats de la commande
        return {"tasks": tasks, "file_name": "project.ntp"}
```

:::info
Remarquez que la scène Natron a été mise sur le lecteur `P:` parce qu'elle doit être syncronisée pour que les **ordinateurs de la farm aient accès aux fichiers**.
:::

Pour l'instant, nous fournissons manuellement une commande qui sera exécutée en une seule task sur la farm. Nous utilisons la classe [`silex_client.utils.farm.Task`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/farm.py#L21) qui accepte directement une liste d'arguments et crée une commande.

Cela équivaut à :

```python
task = farm.Task("1-10")
task.addCommand(farm.Command(argv=command.split(" ")))
tasks = [task]
```

#### Lancement du job

Après avoir lancer une action `Submit` (depuis le shelf Maya par exemple), appuyer sur `Continuer` jusqu'à ce que l'action soit terminée.

Si tout se passe bien, rendez-vous sur le [tableau de bord de Tractor](http://tractor/tv) pour voir le résultat :

![](/img/farm_test_natron.png)

En double-cliquant sur la Task (rectangle rouge), vous obtenez quelque chose comme ceci :

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

:::danger Pourquoi y a-t-il une erreur ?

Il y a une _error_ parce que l'ordinateur de la farm (`md12-2021-002`) **ne peut pas accéder aux fichiers** sur le lecteur `P:`.

Selon le NAS où se trouvent les fichiers du projet, **nous devons monter un lecteur réseau pointant vers cet emplacement**.

:::

#### Wrapping avec la commande mount

Pour monter le lecteur réseau, nous utilisons le [package Rez](https://github.com/ArtFXDev/silex-rez/blob/prod/packages/utils/mount_render_drive/1.0.0/platform-windows/mount_rd.ps1) :

```shell
$ rez env mount_render_drive -- mount_rd_drive ana
```

Le problème est que la [création de dex commandes sur Tractor cause des problèmes...](../../../Renderfarm/Tractor/issues#running-multiple-commands-on-the-same-blade)

Nous utilisons donc un helper pour wrap la commande avec la commande mount. Pour cela, nous devons d'abord utiliser la classe [`CommandBuilder`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/command_builder.py#L5) qui utilise le [modèle du builder](https://doc.rust-lang.org/1.0.0/style/ownership/builders.html) :

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

Il en résulte la commande suivante :

```shell
$ rez env cmd_wrapper -- cmd-wrapper "--pre=\"rez env mount_render_drive -- mount_rd_drive ana\"" "--cmd=\"rez env natron -- natronrenderer -w Write1 P:\\test_pipe\\test\\render\\out.####.exr 1-10 P:\\test_pipe\\test\\project.ntp\""
```

et les logs :

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

Ça fonctionne!!!! 🎉🎉🎉

### Ajout de paramètres

#### Paramètre unique

Le fait est que notre submitter ne fait que la même scène et les même frames tout le temps... 🤔

Il faut d'abord que l'utilisateur sélectionne son fichier de projet dans le submitter. Pour cela on spécifie un dictionnaire de `paramètres` et on utilise le type de paramètre `TaskFileParameterMeta` :

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

Dans l'intercace, il affiche un composant d'explorateur de fichier afin que l'utilisateur puisse sélectionner sa scène à submit. **Il affiche seulement les fichiers `.ntp` comme spécifié dans le type de paramètre**.

![](/img/natron_file_explorer.png)

Ensuite, nous utilisons ce paramètre dans la commande de code :

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
Notez que nous avons spécifié le type `scene_file: pathlib.Path`. Les paramètres sont automatiquement cast dans leurs propres typess lorsqu'ils sont données à une commande.
:::

:::caution
Utilisez la méthode [`PurePath.as_posix()`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.as_posix) pour convertir un chemin Windows en chemin POSIX standard avec des **slashes**. Cela peut causer des problèmes sur la farm lors de l'analyse de la commande autrement.  
:::

#### Chemin de sortie d'image

Maintenant que nous pouvons fournir la scène, la destination de l'image rendue dépendra de la task de la même manière. Pour cela, nous utilisons la commande [`BuildOutputPath`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/build_output_path.py#L28). Nous devons l'ajouter à la définition de l'action YAML :

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

Il va d'abord demande une extension, puis construire le chemin. Utilisez-le en connectant les sorties et les entrées avec la directive YAML `!command-output` :

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

Ce qui donnera ce chemin de sortie (en sélectionnant `png` par exemple) :

```
P:\test_pipe\shots\s03\p060\layout_main\publish\v000\png\render\Write1\test_pipe_s03_p060_layout_main_publish_v000_render_Write1.####.png
```

### Fractionnement de la plage de frame

La dernière chose à faire est d'utiliser toute la puissance de la render farm: **la parallélisation**.

En bref : répartir le calcul sur plusieurs ordinateurs et les faire fonctionner **simultanément**.

Pour ce faire, nous devons **diviser la plage de frame** que l'artiste veut rendre, disons `1-500` dans des morceaux de frames. Comme `10` frames sur chaque ordinateur.

Pour représenter les expressions de plage de frame , nous utilisons la classe `FrameSet` de la bibliothèque [Fileseq](https://github.com/justinfx/fileseq/) Python. Il permet de représenter des expressions de range complexes comme `1-10, 50-80x2` (avec des paddings...).

Nous fournissons un paramètre `FrameSet` et un `task_size` qui définira le **nombre de frames par task/ordinateur**:

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
            # Copier la commande initiale
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
Nous utilisons [`frames.split_frameset`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/frames.py#L16) pour diviser une expression `FrameSet` en morceaux égaux.
:::

:::info
Notez que nous avons utilisé `action_query.context_metadata["project_nas"]` dans l'appel de fonction `wrap_with_mount`. **Le NAS du projet est stocké dans le contexte d'action**, donc nous l'utilisons au lieu d'une valeur explicite.
:::

#### Handling frame padding

Lorsque vous utilisez une plage de frame avec un frame padding : `1-10x2` et une taille de task de `3` qui donnera `["1-5x2", "7,9"]` mais le problème est que **Natron ne comprends pas** `-w Write1 out.###.exr 1-5x2 ...`.

En utilisant `rez env natron -- natronrenderer -h`, nous pouvons voir la syntaxe requise :

> Une ou plusieurs plage de frame, séparées par des virgules.
> Chaque plage de frame doit être l'une des suivantes :
>
> - &lt;frame> (un seul numéro de frame, ex. 57)
> - &lt;firstFrame>-&lt;lastFrame> (ex. 10-40)
> - &lt;firstFrame>-&lt;lastFrame>:&lt;frameStep> (ex. 1-10:2 rendrait 1,3,5,7,9)
>   Exemples:
>   1-10:1,20-30:2,40-50
>   1329,2450,123,1-10:2

Ainsi, nous pouvons facilement remplacer n'importe quel caractère `x` par `:` en `1-50x2` -> `1-50:2`.

```python title="silex_client/commands/farm/natron_render_tasks.py"
chunk_range = str(chunk).replace("x", ":")
chunk_cmd.param("w", [write_node, output_path, chunk_range])
```

Maintenant, il fonctionne parfaitement!! 👌👌

<details><summary>Fichier final de définition d'action<code>natron.yml</code></summary>

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

<details><summary>Fichier de commande <code>natron_render_tasks.py</code> final</summary>

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
            # Copier la commande initiale
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

## Aller plus loin 🚀

Quelques idées pour améliorer le submitter :

- Gérez plusieurs nodes d'écriture. Utilisez des subtasks pour atteindre cet objectif dans Tractor. Voyez le [submitter V-Ray avec les render layers](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/farm/vray_render_tasks.py#L103) pour un exemple complet.

- Une fois le fichier projet `.ntp` sélectionné, ouvrez-le en arrière-plan et remplissez le paramètre `write_node` avec tous les nodes d'écriture de la scène. Nous l'avons fait [dans le submitter Houdini](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/farm/houdini_render_tasks.py#L235).

- Parcourez le graphique des nodes et construisez un graphique de dépendance des nodes d'écriture et construisez-le pour Tractor. En fait, les nodes d'écriture peuvent être utilisés comme nodes de lecture

- Quand un node de lecture ne peut trouver un fichier, Natron ne retournera pas un code de retour différent de `0`. Il y a donc une erreur dans le rendu mais Tractor le voit comme terminé. Vous pouvez soit [l'ajouter dans des messages d'erreur personnalisées dans le code blade](https://github.com/ArtFXDev/tractor-blade-patch#bladetractorsitestatusfilterpy) ou déposer un problème sur GitHub pour demander pourquoi.

  > Voir ce fil sur le code de retour de Natron : https://discuss.pixls.us/t/error-while-rendering-rendering-failed-return-code-is-0/31155
