---
id: command-definition
title: Définition de commande
sidebar_position: 40
---

Les commandes sont définies comme des classes python qui héritent de [`CommandBase`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/action/command_base.py)

## Où dois-je placer mes commandes ?

Où vous voulez tant que c'est importable par python. Donc pour rendre votre classe importable, vous devez ajouter le dossier racine à la variable d'environnement `PYTHONPATH`, comme une bibliothèque python normale. Cependant, nous utilisons une convention uniquement à des fins d'organisation :

```
📦my_plugin
 ┗ 📂commands
   ┣ 📂command_category
   ┃ ┗ 📜your_command.py
   ┣ 📂command_category
   ┃ ┗ 📜your_command.py
```

## Schéma de définition des commandes

La définition de commande suivante n'a pas d'indice de type pour simplifier. En production, vous devez taper tous les paramètres.
Tous les attributs/méthodes qui sont définis sont optionnels, si vous ne les implémentez pas, ils ne feront rien et auront des valeurs vides

```python
from silex_client.action.command_base import CommandBase

class MyCommand(CommandBase):
    """
    Small description about my command
    """

    # L’attribut parameters définit la liste des paramètres de la commande
    parameters = {
        "my_parameter": {
            # Le label est juste pour l'affichage, vous pouvez l’omettre, dans ce cas le nom sera utilisé (la key de cette commande)
            "label": "<string> (default: value in the key)",
            # Le type de valeur attendu pour ce paramètre (voir la section types de paramètres plus bas)
            "type": "<type> (default: NoneType)",
            # La valeur par défaut de ce paramètre
            "value": "<any> (default: None)",
            # Un peu d’aide qui sera affichée sur l’interface utilisateur
            "tooltip": "<string> || null (default: null)"
            # Préciser si ce paramètre doit être affiché sur l’interface utilisateur
            hide: "<boolean> (default: false)"
        },
    }

    @CommandBase.conform_command()
    async def __call__(self, parameters, action_query, logger):
        # Code à exécuter lorsque la commande sera exécutée

    async def undo(self, parameters, action_query, logger):
        # Code à exécuter lorsque la commande est annulée

    async def setup(self, parameters, action_query, logger):
        # Code à exécuter chaque fois qu’un paramètre change
```

Les trois méthodes disponibles prennent les mêmes trois paramètres :

- parameter: Un dictionnaire contenant le nom et une **copie** de la valeur du paramètre (Le fait qu'il s'agisse d'une copie est très important).
- action_query: La requête d'action qui appelle cette commande, vous pouvez accéder à toutes les commandes de celui-ci
- logger: Utilisez cet enregistreur au lieu de l'enregistreur global. Cet enregistreur stocke les logs dans la commande elle-même et l'affiche à l'utilisateur dans la section de debug de l'interface utilisateur

La méthode de configuration, doit être rapide à exécuter, il est utilisé pour les entrées utilisateur de post-traitement ou pour modifier dynamiquement certaines valeurs en fonction de l'entrée. Par exemple :

```python
async def setup(self, parameters, action_query, logger):
    task_parameter = self.command_buffer.parameters["task"]
    task_parameter.hide = parameters.["use_current_context"]
```

Ici, lorsque l'utilisateur bascule sur le paramètre `use_current_context`, le paramètre `task` se cachera dynamiquement

## Types de paramètres

Le type de paramètre peut être n'importe quelle définition de classe, `"type": str`, `"type": list`, `"type": int` sont tous des types valides.
Cependant, pour des paramètres plus complexes comme un menu déroulant ou un sélecteur de fichiers, vous pouvez utiliser certains paramètres spéciaux trouvés dans le [module des types de paramètres](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/parameter_types.py).

```python
from silex_client.utils.parameter_types import SelectParameterMeta

class MyCommand(CommandBase):
    parameters = {
        "my_parameter": {
            "type": SelectParameterMeta("foo", "bar", "baz")
        }
    }
```

Ici nous utilisons le SelectParameterMeta, qui est une liste déroulante qui renvoie un string (la valeur sélectionnée). Ces paramètres sont différents car ce sont en fait des fonctions qui prennent des paramètres. La liste complète ne sera pas détaillée ici, vous pouvez jeter un oeil au [module des types de paramètres](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/parameter_types.py) pour la liste complète des types de paramètres spéciaux.

## Héritage de commande

Il est possible d'hériter d'une autre commande. Il fonctionne comme un héritage normal en python, sauf que le paramètre sera fusionné (merge) avec les paramètres des enfants. Pour les overrides de méthode, vous pouvez simplement utiliser `super()` comme dans l'héritage python normal.
