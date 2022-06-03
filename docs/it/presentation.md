---
id: presentation
title: Présentation
---



# Presentation

Outils deployés

- Silex desktop: enclencher nimby, file manager. En l'état, probleme d'installation avec fog, mais le systeme de deploiement va changer.
  - Pour les etudiants, silex desktop (installé en etudiant), service de kill (GOKILL install systeme), tractor blade (install systeme) pour utiliser l'ordi sur la farm, Rez, ports TCP à ouvrir (GO Kill 5119, pour gerer le nofreeslot, 5118 pour avoir le statut de silex a distance, 9005 port des blades), deploiement de vray, probleme avec les variables d'environnement systeme (les mettre au niveau etudiant)
  - Pour les 5RN, meme chose + Resilio, configuration resilio powershell pour merge le msi d'installation et la config (on se retrouve avec 1 msi par groupe), supprimer hrender sur les machines locales pour qu'il prenne celui de rez, montage marvin pour le disque P, copier les packages rez en local (pour aller plus vite) (idealement utiliser le cache)
- Scripts powershell pour deployer chaque systeme, a part pour les .msi qui sont deployés directement dans fog (ex Resilio). Les scripts powershells sont stockes sur un serveur samba (192.168.2.112).
- Resilio
- Rez, à deployer, via un script powershell. Ne peut pas seservir de la version embeddable. Ont utilisé la version python de scoop (package manager pour windows) pour avoir un venv et un truc facilement deployable. Il faut une variable d'environnent qui pointe sur la config qui est sur le samba.
- Version python : se baser vfxplatform.com
- Tractor, c'est un peu de la merde. Deadline serait plus pratique. A priori on peut garder tel quel. Il faut que tractor s'authentifie sur kitsu, script perso par joseph. Tractor, quand on se login dessus, lance un script python qui fait un est de login kitsu avec.
- Serveur de preprod (pour faire des tests + contient les conteneurs hotfix et pas tres officiels) et prod : containeurs docker, base de donnees kitsu, api rest et api graphql pour communiquer avec, bdd harvest, api pour communiquer avec harvest, nginx reverse proxy pour les frontend (silex, harvest, kitsu/cgwire), zammad systeme de ticket, front de la doc de silex (docusaurus) + des trucs temporaires qui vont pas rester.
- Actuellement le serveur de preprod sert aussi de samba pour mettre tous les packages rez (faut il un serveur specifique pour ca ?). Olivier y stocke aussi ses scripts powershell, sur le samba.
- Configuration de nginx pour renvoyer vers les differents services

Adresse samba :
\\prod.silex.artfx.fr\rez

linux, windows : sert au deploiement
packages : sert pour rez
houdini : hda custom des etudiants (devrait etre un package rez)
arnold : shaders custom osl des etudiants (devrait etre un package rez)
nuke : guizmo custom (devrait etre un package rez)
transfert : sert à stocker les fichiers a transferer, il y a les docs de prez
