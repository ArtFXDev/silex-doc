Zammad est l'outils utilisé pour le suivi des tickets.

|         |                             |
| ------- | --------------------------- |
| Adresse | `http://192.168.2.111:8081` |

Zammad tourne dans un container sur la preprod.

## Création de ticket

Il y'a deux moyen de créé un tickets, via l'interface Siles dans le menu ticket, ou par mail à `silex-support@artfx.fr`.

## Email

Il existe 2 addresses email associé à Zammad.
La reception des tickets par mail ce fait via `silex-support@artfx.fr` et la sortie par `silex@artfx.fr`
Pour la notification par mail, qu'on peut configurer dans sont profil utilisateur zammad, l'email de notification est également envoyé via `silex@artfx.fr`

Pour administrer les paramétres liés aux emails : `http://192.168.2.111:8081/#channels/email`

| email                  | roles                     |
| ---------------------- | ------------------------- |
| silex-support@artfx.fr | inbound                   |
| silex@artfx.fr         | outbound and notification |
