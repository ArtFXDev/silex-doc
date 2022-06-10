---
id: plugins
title: Plugins
---

---

## Intro :

Silex uses different plugins. One for each DCC add to the pipeline.

While the core of **Silex** is coded in the [silex_client](../Client/client.md) git repostory, each DCC has its own repository.

Maya --> _silex_maya_

Houdini --> _silex_houdini_

When you open a DCC from silex, the DCC's repositroy is used. It add special features in a **Silex** shelf, and combines all features from silex_client in addition to the features specific to the DCC.

---

## In the belly of the repository :

A repository basically contains commands and actions to be triggered in the DCC.

### Structure of the repository :

Here is an exemple with the maya repository:

- silex_maya
  - commands
  - config
  - utils
- startup

<u><b>Contents :</b></u>

_silex_maya/commands_ : Contains the commands related to the DCC. [Commands](../Client/command-definition.md) can use the DCC api, so some [Commands](../Client/command-definition.md) can have identical name in other other plugins, but the code is different.

_silex_maya/config_ : This one contains **actions** (see : [action definition](../Client/action-definition.mdx)). Some actions, like the _publish_, requires multiple yaml for multiple purposes.

_silex_maya/utils_ : Contains constants, fonctions, wrappers... used in commands.

_startup_ : It contains startup scripts exectuted in the DCC at startup, including The silex shelf for the DCC and the icons for tools.

:::note
You wil also find a package.py, wich is a [REZ](../../Workflow/Rez/Rez.mdx) package.
:::

---

### Add a new plugin :

To add a new dcc, it's easy. You need :

1. A repository, as described previously, with its [REZ](../../Workflow/Rez/Rez.mdx) package.py.
2. A [REZ](../../Workflow/Rez/Rez.mdx) package for the plugin (dcc) you want to implement.
3. Add acces in the silex_front.

Here is the silex_maya package.py as an exemple :

```python title="silex_maya/package.py"
# pylint: skip-file
name = "silex_maya"
version = "0.1.0"

authors = ["ArtFx TD gang"]

description = """
    Set of python module and maya config to integrate maya in the silex pipeline
    Part of the Silex ecosystem
    """

vcs = "git"

build_command = "python {root}/script/build.py {install}"


def commands():
    """
    Set the environment variables for silex_maya
    """
    env.SILEX_ACTION_CONFIG.prepend("{root}/silex_maya/config")
    env.PYTHONPATH.append("{root}")
    env.PYTHONPATH.append("{root}/startup")
    env.XBMLANGPATH.append("{root}/startup/icons")

    parser_module = ".".join(["silex_maya", "cli", "parser"])
    alias("silex", f"mayapy -m {parser_module}")


@late()
def requires():
    major = str(this.version.major)
    silex_requirement = ["silex_client"]
    if major in ["dev", "beta", "prod"]:
        silex_requirement = [f"silex_client-{major}"]

    return ["maya", "python-3.7"] + silex_requirement

```

You can find out more details in the [REZ](../../Workflow/Rez/Rez.mdx) documentation.
