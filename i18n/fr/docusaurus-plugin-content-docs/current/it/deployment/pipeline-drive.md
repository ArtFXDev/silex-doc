---
id: pipeline-drive
title: Pipeline Drive
sidebar_position: 10
---
---

Snapin pour montage P: drive pour les projets 5RN.
Seulement pour les machines de 5RN.

## Pourquoi ?

Nous avons besoin de créér un alias de drive **_P:_** monté sur **_D:/PIPELINE_**, pour que le repath soit transparent entre farm et machine local.<br/>
Quand une tache est envoyée à une blade, la première commande exécutée est celle du montage du P: sur tars ou ana, en fonction du projet.

```
📦pipeline-drive
 ┣ 📜Montage_marvin.bat // ajout du net use for P:
 ┣ 📜set-drive-pipeline.bat // exec set-drive-pipeline.ps1
 ┣ 📜set-drive-pipeline.ps1 // remplace marvin dans le dossier shell:startup pour ajouter P: mappé on D:/PIPELINE
 ┗ 📜snapin.png  // screenshot of fog snapin
```
