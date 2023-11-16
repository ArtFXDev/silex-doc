---
title: Installation
sidebar_position: 10
---

Tractor était destiné à être installé sur une distribution Linux basée sur [RHEL](https://en.wikipedia.org/wiki/Red_Hat_Enterprise_Linux) comme [CentOS](https://en.wikipedia.org/wiki/CentOS) qui est couramment utilisé dans les studios VFX. Mais ce guide inclut des instructions pour l'installer sur une machine basée sur Debian.

### Installer des packages RPM

Le package que vous obtenez de la [page de téléchargement](https://renderman.pixar.com/forum/download.php) est un package [`.rpm`](https://en.wikipedia.org/wiki/RPM_Package_Manager) que vous ne pouvez installer que sur RHEL distros.
Cependant, si vous prévoyez de l'installer sur une machine basée sur [Debian](https://en.wikipedia.org/wiki/Debian), la configuration est un peu différente.

Pour convertir un `.rpm` en package `.deb`, utilisez [Alien](https://github.com/mildred/alien) :

```shell
$ sudo apt install alien

# Convertir en .deb avec des scripts (-c option)
$ sudo alien -d -c Tractor-2.4_2091325-linuxRHEL6_gcc44icc150.x86_64.rpm

# Installe le package deb généré en utilisant dpkg de low level
$ sudo dpkg -i tractor_2.42091325-1_amd64.deb
```

:::info
Répétez cette procédure pour que le serveur de Licence Pixar (Utilitaires de Licence) installe la licence. (par exemple `PixarLicense-LA-24.0_2172149-linuxRHEL7_gcc63icc190.x86_64.rpm`)
:::

### Serveur de Licence

Pour installer le serveur de licence, procédez comme suit (après avoir installé le paquet) :

```shell
$ cd /opt/pixar/PixarLicense-LA-24.0
$ sudo ./linux_installService.sh
```

:::caution
Vous devez avoir un fichier `pixar.license` dans le répertoire `/opt/pixar` pour que l'installation fonctionne.
:::

### Configuration des fichiers de service système

Maintenant le problème est que les services [systemd](https://en.wikipedia.org/wiki/Systemd) ne sont pas installés et configurés. Il permet au service de démarrer/redémarrer au démarrage.
Voir la documentation de Pixar sur la [configuration des services](https://rmanwiki.pixar.com/display/TRA/Setting+Up+Services).

Les fichiers de service systemd se trouvent dans `/opt/pixar/Tractor-2.4/lib/SystemServices`. Copiez ces fichiers dans le dossier de droite et lancez les services :

```shell
# Copier le fichier de maintenance dans le répertoire systemd
$ sudo cp /opt/pixar/Tractor-2.4/lib/SystemServices/systemd /etc/systemd/system
$ sudo systemctl start tractor-engine.service

# Vérifie s'il fonctionne
$ sudo systemctl status tractor-engine.service
```

:::note
Vous pouvez modifier la ligne `Environment="OPTIONS=--debug --log /home/td/tractor/engine.log"` dans `tractor-engine.service` pour ajouter un emplacement de log personnalisé.
:::

### Configuration DNS

Il doit y avoir une entrée dans le serveur DNS de `tractor` et du `tractor-engine` pointant vers le serveur. Il permet aux futures blades et services de se connecter à l'engine.

Pour vérifier si cela fonctionne, vous pouvez utiliser `nslookup` :

```shell
$ nslookup tractor
Server:         172.16.69.160
Address:        172.16.69.160#53

Non-authoritative answer:
Name:   tractor.artfx.fr
Address: 192.168.2.120
```

### Se connecter à l'interface du tableau de bord

Si tout fonctionne comme prévu, vous pouvez aller sur `http://tractor` sur un navigateur pour inspecter l'interface de Tractor.

Félicitations! Tractor va bien 🚜🚜
