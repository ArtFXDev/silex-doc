---
id: context
title: Contexte
sidebar_position: 10
---
---

Silex est sensible au contexte, le point de toutes les actions est que la même action dépendra de l'endroit d'où vous l'exécutez. Le contexte est défini par deux facteurs :

- L'environnement Rez, qui définit les actions et commandes disponibles.
- L'ID de la tâche, qui définira les variables stockées dans les métadonnées du contexte comme le nom du projet, le nom de la tâche, le nom de l'utilisateur, le nom du shot...

## L'environnement Rez

Silex peut charger des plugins dynamiquement grâce à Rez. Chaque plugins enregistrera une liste d'actions et de commandes. L'ordre est important parce que les actions régies peuvent outrepasser et hériter des actions enfants.

## L'ID de la tâche

Vous pouvez accéder à diverses informations sur le contexte actuel avec la classe globale instanciée `Context`. Cette classe se comporte comme un dictionnaire en lecture seule qui vous donne accès à toutes ces informations.

```python
from silex client.core.context import Context

print(Context.get()["task"])
```

Si vous voulez recalculer toutes les métadonnées, vous pouvez utiliser la méthode `compute_metadata()`. Vous pouvez définir la variable d'environnement `SILEX_TASK_ID` avant si vous voulez recalculer les métadonnées pour un contexte différent. (C'est ce que fait l'action set-context.)

Ces métadonnées sont utilisées dans de nombreuses actions pour s'adapter à la scène actuelle.
