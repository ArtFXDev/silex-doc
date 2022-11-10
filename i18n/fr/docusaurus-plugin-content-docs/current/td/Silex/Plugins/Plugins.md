---
id: plugins
title: Plugins
---

---

## Intro :

Silex utilise différents plugins. Un pour chaque DCC ajouter au pipeline.

Alors que le noyau de **Silex** est codé dans le repository git [silex_client](../Client/client.md), chaque DCC a son propre repository.

Maya --> _silex_maya_

Houdini --> _silex_houdini_

Lorsque vous ouvrez un DCC à partir de silex, le repository du DCC's est utilisé. Il ajoute des features spéciales dans un shelf **Silex**, et combine toutes les features de  silex_client en plus des features spécifique au DCC.

---

## Dans le ventre du repository : 🐋

Un repository contient essentiellement des commandes et des actions à déclencher dans le DCC.

### Structure du repository :

Voici un exemple avec le repository maya :

- silex_maya
  - commands
  - config
  - utils
- startup

<u><b>Contenu :</b></u>

_silex_maya/commands_ : Contient les commandes relatives au DCC. Les [commandes](../Client/command-definition.md) peuvent utiliser l'API DCC, donc certaines [commandes](../Client/command-definition.md) peuvent avoir un nom identique dans d'autres plugins, mais le code est différent.

_silex_maya/config_ : Celui-ci contient des **actions** (voir : [définition des actions](../Client/action-definition.mdx)). Certaines actions, comme le _publish_, nécessitent plusieurs yaml à des fins multiples.

_silex_maya/utils_ : Contient des constantes, des fonctions, des wrappers... utilisés dans les commandes.

_startup_ : Il contient des scripts de démarrage exécutés dans le DCC au démarrage, y compris le shelf silex pour le DCC et les icônes pour les outils.

:::note
Vous trouverez aussi un package.py, qio est un package [REZ](../../Workflow/Rez/Rez.mdx).
:::

---

### Ajouter un nouveau plugin : 🏆

Pour ajouter un nouveau dcc, c'est facile. Vous devez :

1. Un repository, comme décrit précédemment, avec son package.py [REZ](../../Workflow/Rez/Rez.mdx).
2. Un package [REZ](../../Workflow/Rez/Rez.mdx) pour le plugin (dcc) que vous shouhaitez implémenter.
3. Ajoutez un accès dans le silex_front.

Voici l'exemple du package.py **silex_maya** :

```python title="silex_maya/package.py"
# pylint: skip-file
name = "silex_maya"
version = "0.1.0"

authors = ["ArtFx TD gang"]

description = """
    Ensemble de module python et de configuration maya pour intégrer maya dans le pipeline silex
    Part of the Silex ecosystem
    """

vcs = "git"

build_command = "python {root}/script/build.py {install}"


def commands():
    """
    Définir les variables d'environment pour silex_maya
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

Vous trouverez plus de détails dans la documentation [REZ](../../Workflow/Rez/Rez.mdx). 🧭
