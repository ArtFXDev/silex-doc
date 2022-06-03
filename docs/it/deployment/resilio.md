Resilio est l'outils de synchronisation entre tout les groupes et les nas.

## Accées

|         |                           |
| ------- | ------------------------- |
| Adresse | `http://172.16.69.2:8443` |

## Configuration

L'eauipe IT va générer les fichiers de config depuis la console resilio, chaque fichiers de config peut avoir des variables pars example GROUP en clés et en valeur le noms du groupe.

Avec cette technique l'association des machines dans chaque groupe sera automatique lors du déploiement sera "automatique".

## Merge fichier .conf et .MSI

Pour faciliter le deploiement avec fog, on a utilisé [ce script](https://github.com/ArtFXDev/silex_fog_snapin/blob/main/resilio/attach-sync-conf-to-msi.ps1) avec la commande `powershell.exe -ExecutionPolicy Bypass -Noprofile ./attach-sync-conf-to-msi.ps1 -MSIPath .\Resilio-Connect-Agent_x64.msi -SyncConfPath .\sync.conf`

A la sortie de la commande cela donnera un seul .msi qu'ont peut déployer via un fog snapin.

## Comment désinstaller proprement Resilio

En supposant que vous avez déployer resilio avec FOG en tant que user SYSTEM.

L'utilisation de PsExec est disponible uniquement avec une powershell démarrer en administrateur.

1. Telecharger PsExec:
   - PsExec est trouvable ici [PsTools](https://docs.microsoft.com/en-us/sysinternals/downloads/psexec)
   - Extraire PsExec qui ce trouve dans le .zip et placez le dans le C:/ (pour que ce soit plus simple, il est aussi disponible ici \\192.168.2.112\rez\windows\PsExec.exe)
2. Ouvrir un powershell en tant qu'administrateur dans C:/.
3. Ecrire `.\PsExec.exe -i -s powershell.exe` pour ouvrir un powershell en tant que user system.
4. Lancer le meme .msi que celui installé, dans l'interface qui s'ouvre on a l'option pour supprimer le client resilio.
   - Quand on desinstall resilio, la plupart du temp le service windows explorer.exe plante (plus de barre de tache etc), pour fix ça il faut simplement ouvrir le gestionnaire de tache (ctrl+shift+echap) puis file > run new process et ecrire explorer.exe, tout devrai rapparaitre.
5. Quand on desinstall resilio il faut également supprimer ce dossier `C:\ProgramData\resilio folder` aprés avoir desinstaller resilio.
6. Quand tout est fait c'est bon resilio est desinstaller, vous pouvez reinstaller un client normalement avec PsExec si vous voulez reinstaller en system.

Cette "procédure" fonctionne en cas de remplacement d'un disque de PFE5RN.
