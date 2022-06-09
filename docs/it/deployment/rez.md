---
id: rez
title: Rez
sidebar_position: 30
---

Rez est utilisé pour composer des environnements virtuels à la volée.

## Pourquoi Rez?

Quand on crée une nouvelle scène avec SilexDesktop, rez est utilisé pour lancer le bon logiciel dans un environnement composé avec le bon contexte.<br/>
Rez est aussi utilisé pour passé dans d'autre environment facilement, (dev, beta, prod).<br/>
les packages dev son stocké localement, beta et prod sont stockés sur un serveur samba (\\192.168.2.112\rez)

Vous pouvez retrouver REZ sur GitHub [ici](https://github.com/nerdvegas/rez).

## Packages

Les packages sont stockés ici : \\192.168.2.112\rez

![](@site/static/img/it/package_root.png)

Pour une question de performance, le dossier lib est copié localement en utilisant le snapin `rez-install-from-network`.

silex-rez est la racine du dosser pour tous les packages REZ du pipeline.

![](@site/static/img/it/silex_rez_package.png)

```
📦silex-rez packages
 ┣ 📂5rn  // packages des projets 5rn, pour ajouter des dépendances au besoin
 ┃ ┣ 📂achromatic
 ┃ ┣ 📂fady
 ┃ ┣ 📂la_mouche
 ┃ ┣ 📂la_tielle_setoise
 ┃ ┣ 📂macula
 ┃ ┣ 📂my_dog_ate_the_moon
 ┃ ┣ 📂nelliebly
 ┃ ┣ 📂pek
 ┃ ┣ 📂quit_smoking
 ┃ ┣ 📂skyrace
 ┃ ┣ 📂supower
 ┃ ┣ 📂test_pipe
 ┃ ┣ 📂watchers
 ┃ ┣ 📂what_about_cooking
 ┃ ┗ 📜.rez
 ┣ 📂dcc  // packages dcc, par example, houdini installé au même endroit sur chaque machine.
 ┃ ┣ 📂houdini
 ┃ ┣ 📂maya
 ┃ ┣ 📂nuke
 ┃ ┗ 📜.rez
 ┣ 📂silex  // pipepline packages
 ┃ ┣ 📂aiogazu
 ┃ ┣ 📂silex_client
 ┃ ┃ ┣ 📂beta.0.1.0
 ┃ ┃ ┗ 📂prod.0.1.0
 ┃ ┣ 📂silex_houdini
 ┃ ┃ ┣ 📂beta.0.1.0
 ┃ ┃ ┗ 📂prod.0.1.0
 ┃ ┣ 📂silex_maya
 ┃ ┃ ┣ 📂beta.0.1.0
 ┃ ┃ ┗ 📂prod.0.1.0
 ┃ ┣ 📂silex_nuke
 ┃ ┃ ┣ 📂beta.0.1.0
 ┃ ┃ ┗ 📂prod.0.1.0
 ┃ ┗ 📜.rez
 ┣ 📂softwares  // les autres logiciel et moteur de rendu, pour faire des variants par dccs
 ┃ ┣ 📂aces
 ┃ ┣ 📂arnold
 ┃ ┣ 📂python
 ┃ ┣ 📂tractor
 ┃ ┣ 📂vray
 ┃ ┗ 📜.rez
 ┗ 📜.rez  // les fichiers .rez sont utilisés avec la config rezconfig.py modifié pour descendre plus bas dans les arborescences de dossier.
```
