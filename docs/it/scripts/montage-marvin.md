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
This script is for the snapin fog.
We copy montage_marvin.bat to the startup directory of the local computer.
All the scripts available in this folder will be executed on the startup. 
```py
# montage_marvin.ps1
#mount network
New-PSDrive -Name S -Root \\prod.silex.artfx.fr\rez\ -PSProvider FileSystem

# Copy .bat
Copy-Item S:\windows\montage_marvin\montage_marvin.bat -destination "C:\Users\etudiant\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup" -Force
```

# Contenu du Script
We only add a row for the P: alias
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
