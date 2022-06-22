---
id: resilio
title: Resilio
sidebar_position: 20
---
---

## Présentation

Resilio est l'outil de synchronisation entre tous les groupes et les nas.

## Configuration

L'équipe IT va générer les fichiers de config depuis la console resilio, chaque fichier de config peut avoir des variables par exemple GROUP en clés et en valeur le nom du groupe.

Avec cette technique l'association des machines dans chaque groupe sera automatique lors du déploiement sera "automatique".

## Merge fichier .conf et .MSI

Pour faciliter le déploiement avec fog, on a utilisé [ce script](https://github.com/ArtFXDev/silex_fog_snapin/blob/main/resilio/attach-sync-conf-to-msi.ps1) avec la commande `powershell.exe -ExecutionPolicy Bypass -Noprofile ./attach-sync-conf-to-msi.ps1 -MSIPath .\Resilio-Connect-Agent_x64.msi -SyncConfPath .\sync.conf`

À la sortie de la commande cela donnera un seul .msi qu'on peut déployer via un fog snapin.

## Comment désinstaller proprement Resilio

En supposant que vous avez déployé resilio avec FOG en tant que user SYSTEM.

L'utilisation de PsExec est disponible uniquement avec une powershell démarrer en administrateur.

1. Télécharger PsExec:
   - PsExec est trouvable ici [PsTools](https://docs.microsoft.com/en-us/sysinternals/downloads/psexec)
   - Extraire PsExec qui ce trouve dans le .zip et placez-le dans le C:/ (pour que ce soit plus simple, il est aussi disponible ici \\192.168.2.112\rez\windows\PsExec.exe)
2. Ouvrir un powershell en tant qu'administrateur dans C:/.
3. Écrire `.\PsExec.exe -i -s powershell.exe` pour ouvrir un powershell en tant que user system.
4. Lancer le même .msi que celui installé, dans l'interface qui s'ouvre on a l'option pour supprimer le client resilio.
   - Quand on désinstalle resilio, la plupart du temps le service windows explorer.exe plante (plus de barre de tâches etc), pour fix ça il faut simplement ouvrir le gestionnaire de tâche (ctrl+shift+echap) puis file > run new process et écrire explorer.exe, tout devrait réapparaitre.
5. Quand on désinstalle resilio il faut également supprimer ce dossier `C:\ProgramData\resilio folder` aprés avoir desinstaller resilio.
6. Quand tout est fait c'est bon resilio est désinstallé, vous pouvez réinstaller un client normalement avec PsExec si vous voulez réinstaller en system.

Cette "procédure" fonctionne en cas de remplacement d'un disque de PFE5RN.

## Accès

|         |                           |
| ------- | ------------------------- |
| Adresse | `http://172.16.69.2:8443` |
