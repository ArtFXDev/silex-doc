---
id: event-loop
title: Boucle d'événement
sidebar_position: 50
---

Silex exécute une boucle d'événement dans un thread secondaire. Cette boucle d'événement est utilisée pour exécuter la connexion websocket, et les multiples actions en cours d'exécution.

## Problèmes que vous pourriez rencontrer

- Puisque les actions silex et la connexion websocket sont exécutées dans la même boucle d'événement, si une action retient l'attention
  de la boucle d'événement pendant trop longtemps, la connexion websocket pourrait se rompre. Ce n'est en fait pas un problème puisque socketio gère la déconnexion
  et la reconnexion automatiquement, mais vous recevrez un message d'avertissement dans l'interface silex. Pour éviter cela, assurez-vous de séparer votre logique
  d'action en plusieurs coroutines.

- Certaines instructions peuvent prendre du temps et ne sont pas attendues (comme les appels système). Pour éviter cela,
  silex a la fonction [execute_in_thread](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/thread.py).
  L'utilisation de [execute_in_thread](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/thread.py) exécutera
  l'exécution dans un thread différent et retournera un futur avec le résultat.

## Intéraction avec les DCCs

La plupart des DCCs ne gèrent pas très bien la lecture réciproque, et aucun d'eux n'est utilisable avec asyncio. Pour rendre toutes les fonctions DCCs attendues, nous avons fait de la classe
[ExecutionInThread](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/thread.py) une classe appelable afin que chaque DCC
puisse la personnaliser pour travailler avec ses fonctionnalités de threading. (voir la page Silex Plugins pour plus d'infos)

Par exemple, maya fournit la méthode [`executeDefered` et `executeInMainThreadWithResult`](https://knowledge.autodesk.com/support/maya/learn-explore/caas/CloudHelp/cloudhelp/2018/ENU/Maya-Scripting/files/GUID-9B5AECBB-B212-4C92-959A-22599760E91A-htm.html) qui prend un callable comme paramètre.

- `executeDefered` n'est pas bloquant, il s'agit simplement d'ajouter la boucle d'événement propre à maya sans renvoyer le résultat.
- `executeInMainThreadWithResult` bloque, l'appel bloque la boucle d'événement jusqu'à ce que la fonction soit exécutée et renvoie le résultat.

Dans notre cas, nous ne voulons pas utiliser `executeInMainThreadWithResult`, puisqu'il est bloquant, si la commande prend du temps il n'y a aucun moyen pour la boucle d'événement de faire autre chose en attendant le résultat, la connexion websocket se cassera, et si d'autres actions sont exécutées en même temps elle seront toutes bloquées.

C'est pourquoi nous utilisons `executeDefered`. De cette façon, l'appel n'est pas bloquant, mais il y a toujours un problème : comment obtenir le résultat ?

La class [ExecutionInThread](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/thread.py) est en fait en train de wrapping `executeDefered` dans une fonction qui renvoie un futur asyncio stockant le résultat.
The future peut alors être attendu pour que la boucle d'événements continue à fonctionner sur d'autres task jusqu'à ce que le résultat soit prêt.

:::info
Si vous implémentez un nouveau DCC qui ne supporte pas l'asyncio dans son API (ce qui est le plus susceptible de se produire), vous devrez réimplanter cette classe [ExecutionInThread](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/thread.py) pour l'API de threading de ce DCC.
Pour plus de détails, consultez [l'implémentation faite pour maya](https://github.com/ArtFXDev/silex_maya/blob/dev/silex_maya/utils/thread.py)
:::
