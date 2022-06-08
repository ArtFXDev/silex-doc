---
id: silex-desktop
title: Silex Desktop
sidebar_position: 40
---

Silex Desktop est le client du pipeline.
Avec ce logiciel on peut exécuter des actions du pipeline ArtFX sur chaque dcc.
Ouvrir des scènes, publish, conform etc.

## Comment déployer ?

```
📦silex-desktop
 ┣ 📜silex-desktop-Setup-1.0.10.exe // .exe packages for ArtFX
 ┗ 📜SilexDesktopDeploymentFog.png // screenshot des snapin
```

Quand ce snapin sera exécuté sur une machine d'ArtFX, une erreur apparaîtra.<br/>
C'est un comportement normal.

L'erreur apparaît parce que les snapin fog sont exécutés en tant qu'utilisateur system, mais l'application installée s'installe dans **_%appdata%/local_**.<br/> L'utilisateur system n'ayant pas **_d'%appdata%_** une erreur apparaît.<br/>
Mais comme l'installer de l'application l'install pour tous les utilisateurs, l'utilisateur "etudiant" disposera quand meme de Silex Desktop.

Cet exécutable est a utilisé lors du premier déploiement, après l'installation Silex-Desktop va chercher la dernière mise à jour disponible depuis GitHub et se mettra à jour automatiquement.
