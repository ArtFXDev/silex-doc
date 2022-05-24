---
id: montage-marvin
title: Montage Marvin
type: doc
---

# Montage Marvin
Ce scripts à était modifier pour les PFE5RN, il est utilisé pour monter un alias "P:" pointant sur "D:/PIPELINE".
C'est alias P: est du coup utilisé pour tout les paths dans les scenes du pipe, ce qui permet d'éviter une étape de repath coté render farm.
Coté render farm, il suffit de changer lors du rendu l'alias "P:" pointant par example sur le nas ANA.

# Script de deploiement
Ce script est utilisé pour le snapin fog.
Ont copy le fichier montage_marvin.bat dans le dossier de demarrage de la machine local.
Toyut les scripts présent dans le dossier de demarrage sera executer au demarrage de la machine.
```py
# montage_marvin.ps1
#mount network
New-PSDrive -Name S -Root \\prod.silex.artfx.fr\rez\ -PSProvider FileSystem

# Copy .bat
Copy-Item S:\windows\montage_marvin\montage_marvin.bat -destination "C:\Users\etudiant\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup" -Force
```

# Contenu du Script
Nous avons seulement ajouter la ligne de l'alias P:
```bat
rem montage_marvin.bat
@echo off
net use * /delete /yes
subst P: "D:\Pipeline"
net use Z: \\marvin\installers /USER:etudiant artfx2020 /persistent:yes
rem net use P: \\localhost\PIPELINE /persistent:yes
rem net use Y: \\marvin\WIP /USer:etudiant artfx2020 /persistent:yes
exit 0
```
