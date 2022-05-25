---
id: rez-deployment
title: Rez Deployment
type: doc
---

# Rez

## Test for py3
Dans le pipeline ont utilise rez avec la version 3.7.9 de python.
Nous avons donc besoin de la version de python sur chaque machine de la farm.
La premiére étape de ce script est de tester la version de python installer, et d'installer la bonne version de python au besoin.

Pour installer python via un scripts on copie simplement une installation de python embeddable.
Dans les releases python officiel embeddable, les installs ne comprennent pas le packages venv qui est indispensable pour rez, nous n'utilisons donc pas les versions embeddable officiel mais une version de python installé depuis scoop.

## Installation de rez
Dans chaque machine rez est installé dans C:/rez
./ __install__ contient l'install local de rez
./ packages contient les packages locaux, ils sont également copié grace au scripts en local.
Le path vers l'executable de rez est également ajouter à la variable d'environnement PATH.
Le path vers le fichier de configuration rez est situé ici `\\192.168.2.112\rez\windows\config\rezconfig.py` et est ajouté à la variable REZ_CONFIG_FILE

## Scripts
Scripts du snapin:
```py
# rez-install.ps1
#mount network
New-PSDrive -Name S -Root \\prod.silex.artfx.fr\rez\ -PSProvider FileSystem

#install rez if not exist
Remove-Item -Recurse -Force "c:\rez"
New-Item -ItemType Directory -Force -Path "c:\rez\__install__"
Copy-Item S:\windows\rez-2.95.0 -destination "c:\rez\rez-2.95.0" -Recurse -Force

$rez_in_path=$env:Path | Select-String "C:/rez/__install__/*"
[Environment]::SetEnvironmentVariable("REZ_CONFIG_FILE", "\\192.168.2.112\rez\windows\config\rezconfig.py", "Machine")
if ($rez_in_path.length -eq 0) {
	[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable('Path', 'Machine')+';C:/rez/__install__/Scripts/rez', [System.EnvironmentVariableTarget]::Machine)
}

## fix python install and install rez ##
# 1. if python exisit ?
$python=&{python -V} 2>&1
if (($p -is [System.Management.Automation.ErrorRecord]) -Or ($python.length -eq 1)) {
	Remove-Item -Recurse -Force "C:\Python37"
	Copy-Item S:\windows\Python37 -destination "C:\Python37" -Recurse -Force
	& "C:\Python37\python.exe" "c:\rez\rez-2.95.0\install.py" "c:\rez\__install__\"
}
else {
	& python "c:\rez\rez-2.95.0\install.py" "c:\rez\__install__\"
}

#remove rez\packages if exist
Remove-Item -Recurse -Force "c:\rez\packages"
Copy-Item S:\packages\lib -destination "c:\rez\packages\lib" -Recurse -Force
if (-Not(Test-Path -Path "c:\rez\packages\.rez")) {
	New-Item "c:\rez\packages\.rez" -ItemType "file"
}
```
