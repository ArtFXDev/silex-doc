Rez est utilisé pour composé des environments virtuel à la volé.

## Pourquoi Rez?

Quand on crée une nouvelle scene avec SilexDesktop, rez est utilisé pour lancer le bon logiciel dans un environment composé avec le bon context.
Rez est aussi utilisé to passé dans d'autre environment facilement, (dev, beta, prod).
les packages dev sont stocké localement, beta et prod sont stocké sur un serveur samba (\\192.168.2.112\rez)

Vous pouvez retrouvé REZ sur GitHub [ici](https://github.com/nerdvegas/rez).

## Packages

Les packages sont stocké ici : \\192.168.2.112\rez

![](https://github.com/ArtFXDev/silex_fog_snapin/blob/main/assets/rez/package_root.png)

Pour une question de performance, le dossier lib est copié locallement en utilisant le snapin `rez-install-from-network`.

silex-rez est la racine du dosser pour tous les packages REZ du pipeline.

![](https://github.com/ArtFXDev/silex_fog_snapin/blob/main/assets/rez/silex_rez_package.png)

```
📦silex-rez packages
 ┣ 📂5rn  // packages des projets 5rn, pour ajouter des dependences au besoin
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
 ┣ 📂dcc  // packages dcc, par example, houdini installé au meme endroit sur chaque machine.
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
 ┣ 📂softwares  // les autres logiciel et moteur de rendu, pour faire des variant par dccs
 ┃ ┣ 📂aces
 ┃ ┣ 📂arnold
 ┃ ┣ 📂python
 ┃ ┣ 📂tractor
 ┃ ┣ 📂vray
 ┃ ┗ 📜.rez
 ┗ 📜.rez  // les fichiers .rez sont utilisé avec la config rezconfig.py modifié pour descendre plus bas dans les arborescence de dossier.
```
