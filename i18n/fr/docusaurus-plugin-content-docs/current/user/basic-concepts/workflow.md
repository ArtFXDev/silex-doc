---
id: workflow
title: Workflow
sidebar_position: 10
---

## publish / work

### Qu'est-ce qu'un dossier Work ? :

Le dossier Work est accessible depuis l'interface comme vous pouvez le voir [ici](../interface/file-explorer.md).
Il s'agit d'un espace libre pour enregistrer les scènes en cours. C'est un dossier qui n'est pas sauvegardé(backup) sur le serveur, et n'existe que dans votre ordinateur. C'est là que vous enregistrez votre scène et les versions incrémentées.

### Un choix dans le dossier Publish :

Le **Publish** est probablement le concept le plus important à saisir dans un pipeline. Quand une scène est publish, cela signifie que la scène est "finie", ou dans sa "version final" et prête pour la prochaine étape dans le pipeline. Cela vaut pour tous les departement, mais un dossier publish est un peu lus que cela et si nous voulons comprendre ce qu'il en est vraiment, nous avons besoin de plus de connaissances sur son fonctionnement.

Il s'agit de connaissances importantes à avoir, et sera utile pour d'autres concepts et services sur Silex ou dans d'autres pipelines. Alors lisez attentivement 👀.

Travaillez dans un pipeline signifie généralement, **travailler avec un serveur**. Pour que ce soit simple, je vais aller droit au but et essayer d'éviter les détails inutiles. Dans Silex, nous utilisons un serveur "connecté" à tous les ordinateurs de l'école ( il y a en fait 2 serveurs, mais pour cette explication, disons qu'il n'y en a qu'un seul ok ? :) ). Puisque le serveur est accessible par tous les ordinateurs dans Artfx, tous les fichiers stockés dans celui-ci peuvent être accessible de **n'importe où** 🌍

Lorsque vous mettez un fichier dans un dossier de **publish**, ce dossier est synchronisé sur le serveur et peut être consulté par n'importe quel ordinateur. Vous comprenez ? Cela signifie aussi que la [renderfarm](../renderfarm/renderfarm.md) sait où se trouve le fichier et peut le rendre dans le cas de la scène Maya, de la scène Houdini, vrscene...

( J'encourage la lecture de la documentation sur la [renderfarm](../renderfarm/renderfarm.md) 🚜 pour plus détails. )

EN OUTRE ! Pour pouvoir rendre une scène sur la [renderfarm](../renderfarm/renderfarm.md), il faut aussi que toutes les textures ou références soient accessible sur le serveur. C'est la partie délicate, et [l'outil de publish](./actions/publish.md) assure que tous les fichiers liés, de quelque façon que ce soit, au fichier publish est également copié sur le serveur. C'est un deuxième aspect important du **Publish**.

:::note
<u>Donc, pour résumer :</u>

- Un fichier publish (un fichier exporté vers le dossier de publish par [l'outil de publish](./actions/publish.md)Silex) est accessible **partout** ainsi que ses références, textures, etc... .

- Un fichier publish n'est que la version finale de votre travail.

(il y aura une, étape par étape complète, exemple plus loin.)
:::

## Contexte et Tasks

Un autre concept important dans Silex est le concept de **task** et de **contexte**.

![](/img/user_guide/workflow/workflow_tasks.png)

Ici dans cette photo, nous venons de cliquer sur le shot 330 (comme vous pouvez le voir dans le rouge). A l'intérieur, vous pouvez voir toutes les différentes **tasks** assignées à ce shot. (Les **tasks** sont l'équivalent de departements dans un studio vfx/3D 🦉)

Par exemple : Layout, lookdev...

Vous pouvez ajouter une nouvelle task personnalisée à la liste en cliquant sur le bouton "+" près du nom du shot. Remplissez ensuite la fenêtre pop up window :

![](/img/user_guide/workflow/workflow_custom_task.png)

:::caution
La liste des tasks est définie par les superviseurs avant le début du projet.
:::

Disons que vous êtes layout artist. Après avoir sélectionné votre Shot ou Asset dans l'exploreur, vous pouvez sélectionner la task **Layout**, et [ouvrir une nouvelle scène](../interface/file-explorer.md) dans la fenêtre de lancement. La nouvelle scène est maintenant ouverte dans un **Contexte** spécifique à cette task. Cela signifie qque les [outils du shelf Silex](./actions/actions.md) prendrons en compte que vous êtes dans une scène de layout pour le shot que vous avez sélectionnée. En d'autres termes, Silex SAIT où vous êtes et l'utilisera pour publishing des fichiers.

Comme mentionné précédemment, [l'outil de publish](./actions/publish.md) exporte la scène ou la sélection dans un dossier publish. Puisque vous travaillez dans une scène de **Layout**, si vous utilisez [l'outil de publish](./actions/publish.md), les fichiers exportés seront accessibles dans le dossier de publish. Vous pourrez y accéder SEULEMENT dans cette task particulière, dans ce shot particulier.

( Pour voir les fichiers publiés, voir la section correspondante dans [Parcourir les fichiers](../interface/file-explorer.md) )

## Exemple de workflow étape par étape :

Avant d'entrer dans le vif du sujet, vous devez lire la documentation sur l'[interface](../interface/interface.md) et [l'explorateur de fichiers](../interface/file-explorer.md)

**Créons un scénario :**

Vous fabriquez une car asset dans Maya et vous travaillez avec un artiste lookDev et un spécialiste du render/lighting.

Vous devez d'abord créer la task et l'asset. Allez à l'asset dans [l'explorateur de fichiers](../interface/file-explorer.md), et ajoutez une catégorie de **Props** de task si elle n'existe pas.

1 :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_click_asset.png)

2 :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_new_asset.png)

3 :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_select_asset_type.png)

Donnez-lui un nom et cliquez sur **créer**. L'accès au nouveau asset et créer un nouveau **prop**. Appelez-le Car.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_new_props.png)

Cliquez sur le nouveau **Prop**.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_click_car.png)

Cliquez sur Modeling (ou créez la task si elle n'existe pas en cliquant sur le button "+")

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_click_modeling.png)

Ouvrir une nouvelle scène

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_open_scene.png)

Ensuite, travaillez sur votre modeling et enregistrez en utilisant l'action [save (enregistrer)](./actions/save.md) dans le shelf silex, et [l'incrément save](./actions/save.md).

Chaque fois que vous sauvegardez, votre scène sera enregistrée dans le dossier **Work**.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_work.png)

Maintenant, vous devez tranférer ce work à l'artiste lookDev. C'est là que l'[action Publish](./actions/publish.md) entre dans le ring 🥊🥊.

Dans le shelf Silex, cliquez sur Publish, et suivez les instructions dans la documentation ici : [Publish](./actions/publish.md)

Lorsque c'est fait, vous pouvez passer à la section de publish dans Silex.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_publish.png)

Vous pouvez voir tous les fichiers de publish ici, les artistes de votre projet peuvent les voir aussi 🤩. Incroyable pas vrai ?
Les fichiers sont dans le dossier **Publish**, il est donc synchronisé sur le serveur et kes autres étudiants y ont accès.

Maintenant, le lookDev artiste peut prendre la scène publish dans son propre dossier work, sur son propre ordinateur. Il suffit de cliquer sur le bouton d'import du fichier publish :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_pull.png)

Et maintenant, il peut l'ouvrir à partir du dossier work pour travailler dessus.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_open_pulled_scene.png)

⚠️ SI VOUS TRAVAILLEZ AVEC DES REFERENCES (ce qui est probablement le cas dans cette exemple), VOUS POUVEZ REFERENCER LE FICHIER PUBLISH SANS LE DEPLACER DANS LE DOSSIER WORK. DE CETTE FACON, SI UNE NOUVELLE VERSION EST PUBLISH, ELLE REMPLACEMENT LA REFERENCE ET L'ARTISTE LOOKDEV N'AURA QU'A RECHARGER LA REFERENCE DANS SA SCENE.⚠️

:::tip

- Si les fichiers ne s'affichent pas sur l'interface, avant d'appeler un TD essayez d'utiliser CTRL + R pour recharger l'affichage. Vous pouvez également cliquer sur le bouton recharger ici.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_reload.png)

- Si vous souhaitez ouvrir le dossier work dans l'explorateur Windows, vous pouvez y accéder en activant le bouton "More details..." ON, en cliquant ici :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_open_work.png)

:::

Si vous avez besoin de changer votre model et de donner une nouvelle version, vous pouvez publish la nouvelle scène et il remplacera celle dans le publish
