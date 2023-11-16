---
title: Problèmes et solutions
sidebar_position: 30
---

## Kill correctement une task sur Windows

Sur la render farm, nous utilisons [Rez](https://github.com/AcademySoftwareFoundation/rez). Rez est très pratique, mais le problème est que lors du lancement d'une commande, il génère un sous-processus dans un sous-shell.

Ceci est problématique lorsque Tractor ou le NIMBY veulent kill le processus sur une Blade parce que le PID visible est celui de la Rez, pas le processus worker. Donc on a fini par kill Rez et le processus de V-Ray tournait toujours sur la machine...

Vous pouvez lire plus de détails sur cette discussion GitHub : https://github.com/AcademySoftwareFoundation/rez/discussions/1250

La solution était de modifier le code blade spécifiquement sur Windows pour kill l'arbre de processus en utilisant `Powershell`:

```python
# TrSubprocess.py

def send_signal(self, sig):
  if subprocess.mswindows:
    subprocess.call(['taskkill', '/F', '/T', '/PID', str(self.pid)])
```

Voir les fichiers patchés ici : https://github.com/ArtFXDev/tractor-blade-patch

:::info
Cette approche est également utilisée du côté de l'utilisateur, le NIMBY s'exécutant dans `silex-desktop`. Il envoie une requête au `silex_GoKillProcess`, un service spécial exécuté sur chaque ordinateur utilisé pour kill un pid dans la session système :

- https://github.com/ArtFXDev/silex_GoKillProcess/blob/a03a61f31beddc714d87483b51d7ee3fd1391110/utils/terminate.go#L8
- https://github.com/ArtFXDev/silex-desktop/blob/3676ba99a58f4951ad1cdaad408883448114d31b/src/utils/blade.js#L47

:::

:::note
Il semble résoudre ce problème. J'ai posté : https://renderman.pixar.com/forum/showthread.php?s=&threadid=45707 (plusieurs propriétaires de task même si max slots est à 1)
:::

## Le problème `"No Free Slots"`

Le `No Free Slots` question est un classique dans l'histoire du pipeline ArtFX (salut Sylvain et Bruno).

Par défaut, chaque blade de la farm a une capacité de slot maximale de `1` ce qui signifie qu'elle ne peut exécuter `1` task simultanément. Lorsque cela se produit, le champ de `note` de la blade passe à `no free slots (1) / aucun slot libre (1)`, ce qui signifie que la blade ne peut pas accepter une autre task.

The issue we saw rising was blades that had the no free slots thing even thought **no tasks were running on the blade**.

Nous avons corrigé cela en kill les noms de processus spécifiques sur les blades affectées dans [Harvest](../harvest) :

https://github.com/ArtFXDev/harvest-api/blob/master/src/schedule/nofreeslots.ts

```js
export async function clearNoFreeSlots() {
  const blades = await getNoFreeSlots();

  blades.forEach(async (b) => {
    const result = await getProcessesQuery(b.addr);
    const processesToKill = ["rez", "maya", "hrender", "kick", "vray"];

    processesToKill.forEach(async (p) => {
      const process: ResultGoKillProcess = result?.data.find(
        (tp: { Name: string }) => tp.Name.toLowerCase().includes(p)
      );
      if (process) await killProcessesQuery(b.addr, process.PID);
    });
  });
}
```

## Exécution de plusieurs commandes sur la même blade

Une task a plusieurs commandes. Vous pourriez penser qu'une task signifie un ordinateur et ainsi les commandes sont exécutées sur la même blade, **vous avez tort !**

Puisque nous voulons monter le NAS du projet avant de faire un rendu, nous voulons le faire en deux commandes. Pendant longtemps, nous avons eu des problèmes parce qu'il montait le lecteur réseau sur une autre machine et donc il n'avait pas accès aux fichiers publish...

Nous avions aussi des blades bloquées parce qu'elles aillaient NIMBY ON entre les deux commandes.

Voir ce thread pour plus d'informations : https://renderman.pixar.com/forum/showthread.php?s=&threadid=45603

Actuellement ce problème est résolu en utilisant un wrapper de commande que j'ai écrit dans Rust (pour apprendre le langage, si vous voulez aussi [le faire en Python](https://github.com/ArtFXDev/silex-rez/tree/prod/packages/utils/command_wrapper) ça ne devrait pas être trop dur) :

https://github.com/johhnry/cmd-wrapper/

Il est compilé sous forme de `.exe` et mis sur le réseau dans les packages Rez.

Il nous permet de faire ce qui suit en une seule commande :

```shell
rez env cmd_wrapper -- cmd-wrapper
  --pre="rez env mount_render_drive -- mount_rd_drive ana"
  --cmd="rez env houdini pek -- hython -m hrender
        scene.hip
        -d surface_reflec
        -o out.$F4.exr
        -v -S
        -f 1001;1002;1003;1004;1005;1006;1007;1008"
```

En passant des commandes sous forme de strings, il lancera toutes les commandes `--pre`, la commande `--cmd` et même si elle échoue, les commandes `--post`.

Il résout également ce problème que j'ai posté : https://renderman.pixar.com/forum/showthread.php?s=&threadid=45739 (à propos de l'ajout d'une task de nettoyage sur Tractor utilisant `task.addCleanup`)

## Clear blade data

:::caution
Soyez prudent lorsque vous cliquez avec le bouton droit sur les blades dans l'interface et appuyez sur `"Clear earlier blade data"`(`"Effacer les données de la blade précédente"`) car il pourrait mettre toutes les blades en mode `No Free Slots` instantanément lorsque vous **le faites sur une grande quantité de blades**.

Filed this bug here : https://renderman.pixar.com/forum/showthread.php?s=&threadid=45857
:::
