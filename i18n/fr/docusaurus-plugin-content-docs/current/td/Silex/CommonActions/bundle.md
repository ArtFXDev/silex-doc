---
id: bundle
title: Bundle
---

---

## Intro :

L'action **Bundle** est mise en oeuvre pour _Maya_ et _Houdini_. Il est basé sur un concept similaire à l'action **Conform**, je recommande donc de lire également [l'action conform](./conform.md).

**Le Bundle se trouve dans** le dossier **config\bundle\\** du repository DCC.

![](/img/bundle_location.png)

---

## Utilisation :

L'action **Bundle** est similaire à la fonction _archive_ dans maya, mais au lie d'exporter la scène et ses références, elle trouve aussi **récursivement** toutes les références dans les fichiers référencés, puis copie toutes les références dans un seul dossier avec la scène, et refait tout avec une variable d'environnement : **BUNDLE_ROOT** dans ce dossier.

Vous avez juste besoin de définir la variable dans votre Windows et vous pouvez utiliser le dossier bundle pour rendre à partir de la render farm externe ou à la maison.

---

## Étapes :

### étape 1

Le bundle trouve toutes les références dans la scène sélectionnée.

### étape 2

Les références sont copiées, une par une, dans le dossier d'exportation (Par défaut, ce dossier sera créé en dehirs de la scène), si un fichier référencé a des références propre, ils passeront par le même processus.

Si une référence ne fait pas partie de la structure du fichier pipeline, ou ne suit pas la même convention d'appelation, le fichier copié sera renommé avec une version **Hashed**.

### étape 3

Les références sont sont repensées dans la scène d'origine avec une variable d'environnement, **BUNDLE_ROOT** vers le nouvel emplacement.

### étape 4

La scène est copiée dans le dossier export.

:::caution

Actuellement, il n'y a aucun moyen de sélectionner un dossier dans l'interface utilisateur, donc les actions n'ont pas besoin d'être spécifiées un répertoire d'exportation, et créera son propre dossier dans le même répertoire que la scène sélectionnée. Si la scène est dans un dossier de **publish** (Signifiant, un dossier qui est synchronisé sur le serveur), le dossier nouvellement créé sera synchronisé et remplira la mémoire.

Il est conseillé de copier la scène dans un lecteur local avant de la bundling, de sorte que le nouveau "dossier BUNDLE" sera également placé dans le lecteur local.
:::

---

<u><b>Documentation utilisateur</b></u> :

[Bundle documentation utilisateur](@site/docs/user/basic-concepts/actions/actions.md)
