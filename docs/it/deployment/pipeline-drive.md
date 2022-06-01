Snapin pour montage P: drive pour les projets 5RN.
Seulement pour les machines de 5RN.

## Pourquoi ?

Nous avons besoin de créé un aliase de drive P: monté sur D:/PIPELINE, pour que le repath soit transparent entre farm et machine local.
Quand une tache est envoyé à une blade, la premiére commande éxécuté est celle du montage du P: sur tars ou ana, en fonction du projet.

```
📦pipeline-drive
 ┣ 📜Montage_marvin.bat // ajout du net use for P:
 ┣ 📜set-drive-pipeline.bat // exec set-drive-pipeline.ps1
 ┣ 📜set-drive-pipeline.ps1 // remplace marvin dans le dossier shell:startup pour ajouter P: mappé on D:/PIPELINE
 ┗ 📜snapin.png  // screenshot of fog snapin
```
