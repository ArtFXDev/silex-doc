---
id: commonactions
title: Actions Communes
sidebar_position: 30
---

Certaines actions sont communes à tous les DCCs. Elles sont mise en œuvre directement dans `Silex Client`, puis personnalisées pour chaque DCCs grâce au contexte.

:::info
Les actions sont définies avec les fichiers YAML. Si vous ne savez pas comment définir une action, consultez la [page de définition des actions](../Client/action-definition.mdx)
:::

## Insertion d'action

Un point commun à ces actions est qu'elles insèrent toutes des actions à l'exécution en utilisant la [commande insert action](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/insert_action.py).
Cette commande résoudra les actions spécifiées et insérera toutes ses étapes et commandes juste après l'étape en cours.
Cela permet d'avoir une action qui s'adapte dynamiquement lors de son exécution.

![](/img/silex/silex_insert_action.gif)

Pour séparer les actionsà insérer et celles à exécuter directement, nous utilisons des [catégories](../Client/action-definition.mdx#where-do-i-place-my-yaml-).
Par exemple, l'action publish permettra à l'utilisateur d'insérer une action parmi les possibles présent dans la catégorie `publish`. Vous pouvez rendre certaines publishes accessible dans certains [contextes](../Client/context.md) ou non en définissant vos publishes dans le plugin que vous souhaitez.
