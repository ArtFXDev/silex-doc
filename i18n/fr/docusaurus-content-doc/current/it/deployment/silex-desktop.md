Silex Desktop est le client du pipeline.
Avec ce logiciel on peut executer des actions du pipeline ArtFX sur chaque dcc.
Ouvrir des scenes, publish, conform etc.

## Comment deployer ?

```
📦silex-desktop
 ┣ 📜silex-desktop-Setup-1.0.10.exe // .exe packages for ArtFX
 ┗ 📜SilexDesktopDeploymentFog.png // screenshot des snapin
```

Quand ce snapin sera executé sur une machine d'ArtFX, une erreur apparaitra.
C'est un comportement normal.

L'erreur apparait parceque les snapin fog sont executé en tant qu'utilisateur system, mais l'application installé s'install dans %appdata%/local. L'utilisateur system n'ayant pas d'%appdata% une erreur apparait.
Mais comme l'installer de l'application l'install pour tous les utilisateur, l'utilisateur "etudiant" disposera quand meme de Silex Desktop.

Cet executable est a utilisé lors du premier deploiement, aprés l'installation Silex-Desktop va chercher la derniére mise a jour displonible depuis GitHub et ce mettra à jour automatiquement.
