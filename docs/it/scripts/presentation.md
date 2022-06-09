---
id: presentation
title: Présentation
type: doc
sidebar_position: 10
---

# Présentation et détails des scripts utilisés lors du déploiement

Cette documentation détails le fonctionnement de chaque script.

La plupart des scripts ont était créé dans la logique de pouvoir être redéployé.<br/>
Seuls certains fichiers comme la blade tractor ne possède pas ce comportement, ce qui nous a obligé à récréer un snapin de `reset_status.ps1` pour redémarrer les services en cas de redéploiement par exemple.
