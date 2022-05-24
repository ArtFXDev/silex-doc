---
id: deploy-package-vray
title: Deploy Package Vray
---

# Presentation
Ce script copie simplement le contenu du plugin v-ray présent sur le 192.168.2.112 sur la machine local.
Le lien entre le dossier sur la machine local et houdini est effectué grace au fichier .json a placé dans le dossier 'package' la où est isntallé houdini. 


# Contenu
```py
# deploy_package_vray.ps1

# mount temporary network
New-PSDrive -Name S -Root \\prod.silex.artfx.fr\rez\ -PSProvider FileSystem

# remove if exist
if(Test-Path -Path "C:\Program Files\Chaos Group\V-Ray\Houdini 18.5.596")
{
	if(Test-Path -Path "C:\Program Files\Chaos Group\V-Ray\Houdini 18.5.596\uninstall")
	{
		Start-Process "C:\Program Files\Chaos Group\V-Ray\Houdini 18.5.596\uninstall\Uninstall.lnk"  -ArgumentList "-auto -quiet=1" -Wait
	}
	Remove-Item -Force -Recurse "C:\Program Files\Chaos Group\V-Ray\Houdini 18.5.596"
}

# Copy package .json file for houdini 
Copy-Item S:\windows\deploy_package_vray\vray_for_houdini.json -destination "C:\Houdini18\packages" -Force
#Copy-Item S:\windows\deploy_package_vray\config.xml -destination "C:\Users\Public" -Force
#Copy-Item S:\windows\deploy_package_vray\config.xml.ori -destination S:\windows\deploy_package_vray\config.xml -Force

# copy all files of the vray plugins to the destination
$src = "S:\windows\deploy_package_vray\vray\*"
$dest = "C:\Program Files\Chaos Group\V-Ray\Houdini 18.5.596_vray5.2.2_stable"

Invoke-Expression "xcopy $src $dest /E /Y"
```
