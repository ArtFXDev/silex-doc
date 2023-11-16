---
id: conform
title: Conform
---

Le conform est utilisée pour déplacer un fichier de l'extérieur du pipeline dans le pipeline.
Il vérifie d'abord toutes les dépendances possibles de ce fichier (textures, références...) et s'assure que le fichier et toutes ses dépendances sont accessibles sur le pipeline.

## Objectif

Le conform est différente selon le type du fichier. Nous pouvons diviser ces types de fichiers en deux catégories :

- Le fichier qui ne peut pas avoir de dépendances de fichiers externes (comme un fichier PNG)
- Le fichier qui pourrait avoir des dépendances de fichiers externes (comme un fichier de scène houdini)

:::tip
La première catégorie est la plus simple, il n'y a presque rien à faire pour implémenter un nouveau type de fichier qui ne peut pas avoir de dépendances de fichier externes. Toutefois, la première catégorie nécessite un traitement spécial.
:::

Le conform peut être séparée en 6 étapes :

1. Sélectionner un fichier conform
2. Build le chemin de sortie pour ce fichier
3. Trouver toutes les dépendances du fichier qui ne sont pas dans le pipeline
4. Appeler le conform pour chaque dépendance trouvée
5. Repath les dépendances à leur nouveau chemin conformé
6. Déplacer le fichier à son emplacement de sortie

Lorsque vous implémentez une nouvelle conform, vous devrez implémenter les étapes `3` et `4` car la façon dont ces étapes sont implémentées est généralement spécifique à chaque types de fichier.

Une partie importante est qu'à l'étape `4` les appels conform un autre se conform à chaque dépendances du fichier, ce qui rend le conform récursif.

:::info
Dans le cas d'un type de fichier qui ne peut pas avoir de dépendances externes, ces étapes n'existent pas, c'est pourquoi elles sont si faciles à implémenter.
:::

## Architecture

Voici un exemple de la conformité Maya :

![](/img/silex/vray_conform_action.jpg)

- L'utilisateur exécute le conform et sélectionne un fichier de scène maya.
- Le conform maya est insérée, et le chemin de sortie de cette scène maya est construit
- Nous trouvons les dépendances de cette scènne maya qui ne sont pas sur le pipeline
- Pour chacune de ces dépendances, nous insérons un autre conform pour chaque dépendances (un seul conform PNG est montré ici)
- Nous rassemblons tous les nouveaux chemins et repath toutes les dépendances de la scène maya pour leur faire pointer leur nouvel emplacement
- Nous copions le fichier de scène maya à son nouvel emplacement et le renommons correctement

:::info
Dans cet exemple nous voyons seulement qu'un png conform a été inséré pour la simplicité. En réalité, un png conform sera inséré pour chaque png qui doit être conforme. Il en va de même pour toutes les dépendances externes comme les VDB, les alembics...
L'action final pourrait finir très grosses pour les grandes scènes avec beaucoup de dépendances.
:::

:::caution
Dans cet exemple, nous avons une profondeur de 2 (un fichier qui fait référence à un autre fichier) mais puisque les fichiers de scène maya peuvent faire référence
à d'autres fichiers de scène maya, le depht peut aller très loin.
:::

## Rédigez votre propre conform

Lorsque vous exécutez l'action conform, la première étape est de sélectionner le fichier que vous voulez conform et ensuite un conform appropriée sera insérée.
Lors de l'insertion du conform appropriée, la commande cherchera les fichiers yaml dans la catégorie `conform`. Ainsi, votre implémentation conform doit être dans un dossier `conform` d'un emplacement `SILEX_ACTION_CONFIG` (voir la section définition de l'action).

The command can auto selecte the conform using the extention of the given file, for that to work your conform must have the same
name as the extension it is made for. For example if you implement a conform for USD files you should organize your file like this:

```
📦config
 ┗ 📂conform
   ┗ 📜usd.yml
```

### Fichier qui ne peut pas avoir de dépendances externes

Ces fichiers n'ont pas besoin d'un traitement spécial, tout ce qui vous avez à faire est d'hériter du conform `default` et de de remplacer le paramètre `output_type` de la commande `build_output_path` :

```yml
vdb: !inherit
  parent: ".default"

  steps:
    conform:
      commands:
        build_output_path:
          parameters:
            output_type:
              value: "vdb"
```

### Fichier pouvant avoir des dépendances externes

WIP

:::tip
Si vous vérifier les fichiers yaml du conform par défaut, vous verrez qu'ils ont plus d'étapes que montré dans l'architecture.
Ces étapes ne servent qu'à stocker globaly les fichiers conforme, et à empêcher le conforming du même fichier à nouveau s'il est référencé plusieurs fois.
:::

:::caution
L'action **.ass conform** utilise une api Maya Arnold qui n'est accessible que depuis Maya. Donc les fichiers **.ass** doivent être conform depuis le shelf d'une scène maya ouverte !
:::
