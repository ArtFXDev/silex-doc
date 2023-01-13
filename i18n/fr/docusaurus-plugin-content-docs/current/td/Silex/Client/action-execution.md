---
id: action-execution
title: Exécution d'action
sidebar_position: 20
---

---

Une action est un ensemble d'instructions qui seront exécutées séquentiellement. Pour en savoir plus à leur sujet, lisez la page du guide de l'utilisateur sur les actions.

## Exécution des actions à partir de CLI

C'est la façon la plus simple d'exécuter une action. Une fois Silex installé, exécutez `silex action <action-name>`.

:::tip
Si vous avez installé le client Silex en tant que package Rez, n'oubliez pas d'exécuter cette commande dans l'environnement Rez: `rez env silex_client -- silex action <action-name>`
:::

#### Task ID

Certaines actions se comportent différement selon le [contexte](./context.md) à partir duquel vous les exécutez (par exemple, le publish définira l'emplacement de publication en utilisant la tâche courante définie dans le contexte).
Vous pouvez spécifier la tâche en utilisant l'argument `--task-id` avec l'ID si l'entité est dans la base de données [CGWire](https://www.cg-wire.com/).

#### Paramètres

Les actions Silex invitent parfois l'utilisateur avec des paramètres. Vous pouvez définir les paramètres à l'avance avec l'argument `--parameters`. La valeur attendue est `<parameter-path>=<parameter-value>` le paramètre sera automatiquement inclus dans le type de paramètre attendu. Pour définir plusieurs paramètres, utilisez cet argument plusieurs fois.

#### Mode Batch

Parfois vous voulez exécuter des actions en mode headless (sur la renderfarm ou sur ssh), dans ce cas vous n'avez pas accès à l'interface silex et quand l'utilisateur sera invité, l'exécution de l'action sera bloquée en attendant une entrée dans l'interface. Pour éviter cela, vous pouvez utiliser `--batch` pour dire à Silex de ne pas essayer de se connecter à l'interface utilisateur via websocket. Tous les paramètres qui nécessitent une entrée utilisateur conserveront leurs valeurs par défaut.

#### Catégories

Si votre action n'est pas dans la catégorie par défaut (la catégorie `actions`) vous pouvez en spécifier une autre en utilisant l'argument `--category` (pour plus d'informations, voir la page de définition des actions)

:::tip
Pour obtenir plus d'informations sur l'interface client silex, utilisez `silex action --help`
:::

## Exécuter des actions à partir de Python

Lorsque vous exécutez une action à partir d'un dcc (avec un shelf button) vous voulez exécuter l'action à partir de python :

```python
from silex_client.action.action_query import ActionQuery

action = ActionQuery("<action-name>")
action.execute()
```

#### Catégories

Si votre action n'est pas dans la catégorie par défaut (la catégorie `actions`) vous pouvez en spécifier une autre en utilisant le paramètre `category` lors de l'instanciation de l'action (pour plus d'informations voir la page de définition de l'actions)

#### Méthodes

L'exécuter d'une action à partir de python est beaucoup plus flexible car l'object ActionQuery vous donne le contrôle à l'exécution.
Voici une liste de méthodes utiles sur ActionQuery, elles peuvent être utilisées pendant l'exécution de l'action.

```python
# Certaines des méthodes suivanteson une version asynchrone (préfixée par 'async_')
# les utiliser si vous voulez les utiliser depuis la boucle d'événements silex.
# (voir la page de la boucle d'événements)

# Définir un paramètre
action.set_parameter("<parameter-path>", <value>)

# Obtenir une commande
action.get_command("<command-path>")

# Arrêter l'exécution en cas d'exécution et revenir en arrière sur une commande
action.undo()

# Suspendre l'exécution
action.stop()

# Reprendre l'exécution
action.redo()

# Synchroniser avec l'interface utilisateur, utiliser cette méthode si vous avez modifié
# le tampon (buffer) de l'action directement (comme obtenir une commande et modifier ses données)
action.update_websocket()
```

## Débogage d'une action

Quand une exécution ne va pas bien, vous pouvez déboguer son exécution en utilisant certaines méthodes de requête d'action. Les instructions suivantes ne peuvent pas être utilisées pour les actions exécutées à partir de la CLI.

- Veiller à régler le niveau de log sur `INFO`, la valeur par défaut est `WARNING`

```python
from silex_client.utils.log import logger
logger.setLevel("INFO")
```

:::caution
`DEBUG` est très verbeux (il enregistre tous les diffs du processus de synchronisation websocket) donc `INFO` est suffisant la plupart du temps
:::

- Si vous n'avez pas stocké l'instance ActionQuery dans une variable (ou si l'action a été lancée à partir d'un shelf button) vous pouvez obtenir l'instance ActionQuery avec son ID à partir du Contexte :

```python
# Pour obtenir l'ID, cliquer sur le bouton à côté du contexte dans
# le panneau de l'action sur l'interface utilisateur. Il stockera l'ID dans votre presse-papiers.
from silex_client.core.context import Context
action = Context.get().actions["<action-id>"]
```

- Vous pouvez utiliser la méthode execute avec l'argument step_by_step (`action.execute(step_by_step=True)`). Ceci exécutera une seule commande et mettra en pause directement. A partir de ce point, il sera plus facile de vérifier toutes les valeurs de la sortie et des entrées. Pour passer à la commande suivante, utilisez à nouveau `action.execute(step_by_step=True)`.

- Certaines commandes / paramètres sont masqués, vous pourriez vouloir les afficher, voici un extrait pour définir chaque commande :

```python
for command in action.commands:
    commands.hide = False

# Toujours utiliser cette méthode après avoir modifié les buffers directement
# pour rester synchronisé avec l'interface utilisateur
action.update_websocket()
```

- Vous pouvez vérifier la sortie d'une commande à tout moment, avec la propriété `output_result`.

```python
print(action.command[<command-index>].output_result)
```

- Vous pouvez vérifier l'entrée d'un paramètre à tout moment avec la méthode get_value. L'entrée de paramètre peut être un lien vers une sortie de commande. Cette méthode résoudra tous les liens s'il y en a et vous donnera la valeur réelle directement.

```python
print(action.command[<command-index>].parameters["<parameter-name>"].get_value(action))
```
