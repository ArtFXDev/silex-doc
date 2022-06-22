---
id: zammad
title: Zammad
sidebar_position: 50
---
---

Zammad est l'outil utilisé pour le suivi des tickets.

|         |                             |
| ------- | --------------------------- |
| Adresse | `http://192.168.2.111:8081` |

Zammad tourne dans un container sur la preprod.

## Création du ticket

Il y a deux moyens de créé un ticket, via l'interface Siles dans le menu ticket, ou par mail à `silex-support@artfx.fr`.

## Email

Il existe 2 adresses email associées à Zammad.
La réception des tickets par mail ce fait via `silex-support@artfx.fr` et la sortie par `silex@artfx.fr`
Pour la notification par mail, qu'on peut configurer dans son profil utilisateur zammad, l'email de notification est également envoyé via `silex@artfx.fr`

Pour administrer les paramètres liés aux emails : `http://192.168.2.111:8081/#channels/email`

| email                  | roles                     |
| ---------------------- | ------------------------- |
| silex-support@artfx.fr | inbound                   |
| silex@artfx.fr         | outbound and notification |
