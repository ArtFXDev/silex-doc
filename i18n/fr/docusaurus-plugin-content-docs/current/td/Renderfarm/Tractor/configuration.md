---
title: Configuration
sidebar_position: 20
---

Les fichiers de configuration de Tractor se trouvent dans `/opt/pixar/Tractor-<major>.<minor>`.

Il y a un repository GitHub sur ArtFXDev qui stocke la configuration pour l'année 2022 : https://github.com/ArtFXDev/tractor-config

Vous pouvez également vérifier la configuration de 2021 : https://github.com/ArtFXDev/tractor-2020

## `tractor.config`

Paramètres globaux pour l'engine.

Quelques paramètres utiles à modifier :

- `EngineOwner`: changer le propriétaire de service du processus (mieux en tant qu'utilisateur non-root)
- `EngineDiscovery`: paramètres DNS pour les blades lors de l'interrogation de l'engine, laissez-le vide pour ne pas multicast (peut flood(innonder) le réseau autrement)
- `SiteCmdLogRetrievalURL`: url pour récupérer les logs (voir [logging blade](#blade-log-access))
- `SiteMaxListReplyCount`: limite le nombre d'enregistrements de liste que vous pouvez obtenir à partir de l'API
- `JobSchedulingMode`: changer le mode de planification des job (nous utilisons principalement `P+ATCL+RR`, voir la [documentation](https://rmanwiki.pixar.com/display/TRA/Scheduling+Modes))
- `CmdAutoRetryAttempts`: définit le nombre de tentatives automatiques pour les commandes qui échouent
- `CmdAutoRetryStopCodes`: exclure le code de retour de réessayer automatiquement la task (utile lorsque vous savez qu'il y a une erreur)
- `EngineWorkerThreads`: définit le nombre de threads et workers de l'engine (conseillé d'être : `10 + (number_of_blades / 100)`)

## `blade.config`

Décrit les profils de blade (groupe d'ordinateurs).

:::info
Les profils sont exclusifs et attribués de haut en bas. Utilisez la liste `Provides` pour attribuer plusieurs tags(étiquettes) aux blades.
:::

Voici un exemple d'un profil correspondant aux blades qui ont un GPU `NVIDIA` :

```json
// blade.config
{
  "ProfileName": "GPU",
  "Hosts": {
    "GPU.label": ["NVIDIA GeForce*"]
  },
  "Provides": ["GPU"],
  "PathExists": [
    "C:/Maya2022/Maya2022/vray/bin/vray.exe",
    "C:/Nuke13.0v3/Nuke13.0.exe",
    "C:/Maya2022/Maya2022/bin/render.exe",
    "C:/Program Files/Autodesk/Arnold"
  ],
  "EnvKeys": ["@merge('shared.windows.envkeys')"]
}
```

:::tip
Pour plus d'informations, voir la [documentation](https://rmanwiki.pixar.com/display/TRA/Server+Profiles) officielle
:::

### Accès au log blade

De la [documentation sur les logging](https://rmanwiki.pixar.com/display/TRA/Logging#Logging-directwritesLoggingCommandOutputtoaCentralFileserver):

> Logging Tractor command output to a central fileserver should be considered a best-practice technique, especially for large production sites.

> Écrire directement sur un partage de réseau haute performance en utilisant des opérations de fichier "locales" peut être presque aussi bon, et offre de nombreux avantages supplémentaires en termes d'accès et de gestion des logs.

> Il y a plusieurs avantages à utiliser un serveur web standard pour livrer ces logs de commande à Tractor Dashboard, et d'autres requestors. Le premier est qu'il peut décharger ce type de fichier i/o de Tractor Engine lui-même. Plus important encore, il peut également permettre aux utilisateurs de parcourir les logs directement à partir d'un navigateur web générique en parcourant simplement les listes de répertoires de job fournies par le serveur web. Évidemment, le serveur de fichiers partagé sous-jacent lui-même fournit un accès similaire aux logs à partir d'utilitaires et de scripts arbitraires utilisant des operations.

Dans l'objet `ProfileDefaults`, nous avons modifié la key suivante pour indiquer aux blades où elles doivent écrire les logs.

```json
// blade.config
{
  "ProfileDefaults": {
    "CmdOutputLogging": "logfile=//prod.silex.artfx.fr/tractor_logs/%u/J%j/T%t.log"
  }
}
```

Pour ce faire, le dossier doit être accessible en tant qu'emblacement réseau Samba avec accès en écriture.

Modifiez également la configuration pour récupérer les logs dans le fichier `tractor.config` pour qu'il soit l'URL du serveur web hébergeant les fichiers statiques :

```json
// tractor.config
{
  "SiteCmdLogRetrievalURL": "http://prod.silex.artfx.fr:8001/%u/J%j/T%t.log"
}
```

## `crews.config`

Spécifiez Administrateur, Wrangler et ValidLogins.

- `Administrator` -> peut reload(recharger) la configuration sur l'interface
- `Wrangler` -> peut modifier les jobs des autres (utile pour le responsable technique de l'équipe)
- `ValidLogins` -> pour l'authentification NIMBY

:::info
Pour utiliser l'authentication utilisateur personnalisée, spécifiez-la:

```json
{
  "SitePasswordValidator": "python3 ${TractorConfigDirectory}/trSiteLoginValidator.py"
}
```

:::

## `limits.config`

Spécifiez des limites pour les tasks et les jobs sur la render farm. Vous pouvez limiter un certain type de job à exécuter uniquement sur max X machines.

Vous précisez également les limites à l'utilisation qu'un project peut faire de la farm.

> Consulter : https://rmanwiki.pixar.com/display/TRA/Limits+Configuration

:::note
Les priorités de job sont parfois plus efficaces que de limiter un project à un pourcentage maximal d'utilisation à la farm.
:::

## `shared.xxxxx.envkeys`

Liste des variables d'environnement pouvant être incluses dans la configuration du profil `blade.config`.

Un exemple de fichier peut être :

```json
// shared.windows.envkeys
[
  {
    "keys": ["default"],
    "environment": {
      // Rez configuration file location on the network
      "REZ_CONFIG_FILE": "//192.168.2.112/rez/windows/config/rezconfig.py",

      // Ana and tars username and password
      "SERVER_USER": "xxxxxx",
      "SERVER_PASS": "xxxxxx",

      // Software license server location
      "foundry_LICENSE": "4101@centlic",
      "ADSKFLEX_LICENSE_FILE": "2080@winlic"
    },
    "envhandler": "default"
  }
]
```

Puis l'utiliser partout sur les profils pour hériter de ceux :

```json
// blade.config
{
  "BladeProfiles": [
    {
      "ProfileName": "DEV",
      "EnvKeys": ["@merge('shared.windows.envkeys')"]
    }
  ]
}
```

## `trSiteLoginValidator.py`

Nous permet de nous authentifier auprès du backend Zou pour la gestion des utilisateur.

Nous faisons une demande à l'API en fournissant l'utilisateur brut et mot de passe.

```python
# trSiteLoginValidator.py
#!/usr/bin/env python

import requests
import sys

def main ():
    user = input()
    challenge = input()
    pw_hash = input()

    # Allow the nimby to eject jobs
    if user == "nimby":
        return 0

    r = requests.post(
      "http://kitsu.prod.silex.artfx.fr/api/auth/login",
      {"email": f"{user}@artfx.fr", "password": pw_hash}
    )

    return 0 if r.status_code == 200 else 1;

if __name__ == "__main__":
    rc = main()

    if 0 != rc:
        sys.exit(rc)
```

:::info
Remarquez la connexion spéciale `"nimby"` pour que le NIMBY se connecte sans mot de passe à l'engine
:::

:::caution
Les mots de passe ne sont pas actuellement hashed, ils peuvent donc être stockés en texte clair dans la base de données...
:::
