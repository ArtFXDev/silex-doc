---
id: silex-desktop
title: Silex Desktop
sidebar_position: 40
---

---

WAPT sera le nouvel outil de déploiement pour déployer des paquets sur les machines, il remplacera les snapins FOG.

## Créé un package

Pour créer un nouveau paquet il faut aller dans l'onglet 'dépôt privé' dans l'interface wapt puis cliquer sur "générer un modèle de paquet".

![](/img/it/wapt_packages/wapt_packages_create_menu.PNG)

Une fenêtre va s'ouvrir pour choisir qu'elle type de paquet on veut créer.

Pour notre exemple on va partir du principe qu'on veut déployer un script, car c'est le plus "compliqué".
![](/img/it/wapt_packages/wapt_packages_create_template_package.PNG)

Il faut choisir ici "paquet vide".

Une fois le paquet l'éditeur est censé s'ouvrir s'il ne s'ouvre pas vous pouvez lancer l'édition d'un paquet en faisant clique droit puis "modifier le paquet dans l'éditeur".

![](/img/it/wapt_packages/wapt_packages_edit_package_menu.PNG)

Une fois que votre éditeur favori s'ouvre vous pouvez vous rendre compte que le langage de script des paquets est Python3 !

Pour exécuter et avoir les logs d'exécution d'un script powershell vous pouvez utiliser ce script python:

```py
from pathlib import Path
import subprocess

SMB_SERVER = r"\\<SERVER_SMB>\<YOUR_FOLDER>"
SCRIPT_NAME = "<YOUR_SCRIPT>.ps1"
def install():
    print("Installing: %s" % control.package)
    script_path = Path(SMB_SERVER) / SCRIPT_NAME
    print(f"Executing {script_path}")
    process = subprocess.Popen(["powershell", "-ExecutionPolicy", "ByPass", "-NoProfile", "-File", script_path],  stdout=subprocess.PIPE)
    p_out, _ = process.communicate()
    print(p_out)
```

## Mettre à jour un package

Une fois vos modifications effectué, vous pouvez mettre à jour le paquet en cliquant sur "importer un paquet" puis "construire et importer un paquet dans le dépôt".

![](/img/it/wapt_packages/wapt_packages_import_package_menu.PNG)

Un explorateur va s'ouvrir et vous devrez sélectionner votre dossier local du paquet. _(par défaut situé sous 'C:\waptdev')._

Une fois l'import effectué il faut cliquer en haut à gauche sur "Actualiser les paquets disponibles" et vous devrez voir votre numéro de version s'incrémenter.

![](/img/it/wapt_packages/wapt_packages_import_package_version.PNG)

## Mettre à jour une machine

Une fois que vous avez créé et/ou mis à jour un paquet, pour lancer son exécution il faut se rendre dans l'onglet "inventaire" dans la barre de recherche, mettre la machine sur laquelle on veut lancer la mise à jour.

![](/img/it/wapt_packages/wapt_packages_register_package_in_computer_menu.PNG)

Si votre paquet n'apparaît pas à droite c'est normal, c'est qu'il n'a pas encore était installé sur cette machine.

Pour enregistrer le paquet dans la machine cliquer sur "Modifier la machine", sélectionner votre paquet dans la fenêtre de droite puis faite "ajouter des dépendances au paquet".

![](/img/it/wapt_packages/wapt_packages_register_package_in_computer.PNG)

Puis cliquer sur enregistrer et appliquer.

Ensuite si le status de la machine ne change pas en "TO-UPGRADE" cliquer sur "vérification des mises à jour" puis sur "Actualiser" et là le status devrait changer.

Pour lancer l'exécution du paquet il suffit alors de cliquer sur "Lancer les installations".

Une fois le paquet installé vous pourrez retrouver les logs à la fin de l'exécution du paquet (statuts passés sur 'ok').
![](/img/it/wapt_packages/wapt_packages_end_install_and_log_on_computer.PNG)
