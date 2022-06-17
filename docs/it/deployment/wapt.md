
WAPT sera le nouvelle outil de déploiement pour déployer des paquets sur les machines,
il remplacera les snapins FOG.

## Créé un package
Pour créé un nouveau paquet il faut aller dans l'onglet 'dépot privé' dans l'interface wapt puis cliquer sur "générer un modéle de paquet".

![](/img/it/wapt_packages/wapt_packages_create_menu.PNG)

Une fenétre va s'ouvrir pour choisir qu'elle type de paquet ont veut créer.

Pour notre example on va partir du principe qu'on veut déployer un script, car c'est le plus "compliqué".
![](/img/it/wapt_packages/wapt_packages_create_template_package.PNG)

Il faut choisir ici "paquet vide".

Une fois le paquet l'editeur est censé s'ouvrir si il ne s'ouvre pas vous pouvez lancer l'edition d'un paquet en faisant clique droit puis "modifier le paquet dans l'éditeur".

![](/img/it/wapt_packages/wapt_packages_edit_package_menu.PNG)

Une fois que votre editeur favori s'ouvre vous pouvez vous rendre compte que le langage de scripts des paquets est Python3 !

Pour executer et avoir les logs d'éxécution d'un script powershell vous pouvez utiliser ce script python:

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


## Mettre a jour un package
Une fois vos modification effectué, vous pouvez mettre à jour le paquet en cliquant sur "importer un paquet" puis "construire et importer un paquet dans le depot".

![](/img/it/wapt_packages/wapt_packages_import_package_menu.PNG)

Un explorateur va s'ouvrir et vous devrez selectionner votre dossier local du paquet.
(par défaut situé sous 'C:\waptdev').

Une fois l'import effectué il faut cliquer en haut a gauche sur "Actualiser les paquets disponibles" et vous devrez voir votre numero de version s'incrémenter.

![](/img/it/wapt_packages/wapt_packages_import_package_version.PNG)


## Mettre a jour une machine
Une fois que vous avez créé et/ou mis à jour un paquet, pour lancer son execution il faut se rendre dans l'onglet "inventaire" dans la barre de recherche, mettre la machine sur laquelle ont veut lancer la mise à jour.

![](/img/it/wapt_packages/wapt_packages_register_package_in_computer_menu.PNG)

si votre paquet n'apparait pas a droite c'est normal, c'est qu'il n'a pas encore était installé sur cette machine.

Pour enregistrer le paquet dans la machine cliquer sur "Modifier la machine", selectionner votre paquet dans la fenetre de droite puis faite "ajouter des dependances au paquet".

![](/img/it/wapt_packages/wapt_packages_register_package_in_computer.PNG)

Puis cliquer sur enregistrer et appliquer.

Ensuite si le status de la machine ne change pas en "TO-UPGRADE" cliquer sur "verification des mise a jour" puis sur "Actualiser" et la le status devrai changer.

Pour lancer l'execution du paquet il suffit alors de cliquer sur "Lancer les installations".

Une fois le paquet installé vous pourrez retrouvé les logs à la fin de l'execution du paquet (status passé sur 'ok').
![](/img/it/wapt_packages/wapt_packages_end_install_and_log_on_computer.PNG)
