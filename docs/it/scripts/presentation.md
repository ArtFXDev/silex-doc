---
id: presentation
title: Presentation
type: doc
---

# Présentation et details des scripts utilisé lors du déploiement
Cette documentation details le fonctionnement de chaque scripts.

La plus part des scripts ont était créé dans la logique de pouvoir être redéployer.
Seul certain fichiers comme la blade tractor ne posséde pas ce comportement, ce qui nous à obligé à récréé un snapin de `reset_status.ps1` pour redémarrer le services en cas de redéploiement par example.
