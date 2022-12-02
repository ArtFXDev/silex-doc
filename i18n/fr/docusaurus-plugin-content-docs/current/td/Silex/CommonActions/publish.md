---
id: publish
title: Publish
---

---

## Intro :

Le publish est l'une des actions les plus importante dans Silex.

Chaque scène envoyée à la renderfarm doit être dans un dossier de publish (qui est synchronisé avec le serveur : voir [introduction Silex](../Silex.md)) ainsi que ses références. De cette façon, les _blades_ (ordinateurs dans la renderfarm) peuvent accéder à tous les fichiers nécessaire au rendering.

## Objectif :

L'action **Publish** est le moyen de sauvegarder vos scènes et références dans le **dossier de publish**. Il exporte plusieurs formats, vérifie que toutes les références sont dans un dossier de publish et renomme le fichier exporté en conséquence avec la convention de nommage.

Le but du **publish** est de s'assurer que chaque job soumis à la [Renderfarm](../../Renderfarm/renderfarm.md) est restituable, et que toutes les références et textures peuvent être atteintes par n'importe quelle _blade_ du réseau. Pour ce faire, l'action appelle l'action [Conform](./conform.md) action. Si les références trouvées dans la scène doivent être [conformes](./conform.md) au pipeline, et ne peuvent pas être accessibles depuis le serveur. L'action **Publish** vous demandera de vous [conformer](./conform.md) à ces références.

### Utilisation étape par étape du publish :

1- Sélectionnez un type de publish.

2- Sélectionner ou taper un nom de fichier.

3- Paramètres de processus spécifiques à la commande appelée pour le type de publish choisi.

4- La commande exporte la scène ou la sélection dans un dossier temporaire.

5- Une commande de **déplacement** à partir de silex_client est appelée pour déplacer le fichier exporté vers le bon emplacement.

---

## Architecture :

Le publish vous permet d'exporter dans un large éventail de formats. Vous pouvez trouver la liste dans le code dans le dossier :

- command
  - config
    - publish

(voir plus d'infos sur l'architecture du repository : [Plugins](../Plugins/Plugins.md)) 🧭

---

### Yummy YAMLs : 🎂

Le publish du fichier [YAML](../Client/action-definition.mdx) dans [silex_client](../Client/client.md) appelle d'autres [YAML](../Client/action-definition.mdx) depuis le dossier commande **command/config/publish** dans les repositories de plugin. Ici, les [YAML](../Client/action-definition.mdx) ont le même nom que l'extension associée au type de publish.

Par exemple, dans [silex_maya](../Plugins/Maya.md) dans **command/config/publish** :

- publish
  - abc.yaml
  - ass.yaml
  - fbx.yaml
  - ma.yaml
  - ...
  - xgen.yaml

Un fichier [YAML](../Client/action-definition.mdx) de publish ressemble à ceci :

```yaml title="ma.yaml"
# Le root doit avoir le même nom que le fichier YAML.
ma:
  steps:
    # Cherche des références et vérifie que tout est conform.
    # Sinon, utilise une action conform
    check_references:
      label: "Check references"
      index: 30
      commands:
        cleanup:
          label: "Cleanup scene"
          path: "silex_maya.commands.cleanup_scene.CleanupScene"
        get_references:
          label: "Get referenced files"
          path: "silex_maya.commands.get_references.GetReferences"
          parameters:
            excluded_extensions:
              value:
                - ".wav"
        conform_references:
          label: "Conform references found"
          path: "silex_client.commands.iterate_action.IterateAction"
          parameters:
            values:
              value: !command-output "check_references:get_references:file_paths"
              hide: true
            actions:
              - "conform"
            categories:
              - "action"
            parameter: "setup:get_conform_output:file_paths"
            label_key: "file_paths"
            output: "setup:append_conform_actions"

    conform_references:
      label: "Repath references"
      index: 40
      commands:
        repath_attributes:
          label: "Repath attributes"
          path: "silex_maya.commands.set_references.SetReferences"
          tooltip: "Set the new path on the attributes"
          parameters:
            attributes:
              value: !command-output "check_references:get_references:attributes"
              hide: true
            values:
              value: !command-output "check_references:conform_references"
              hide: true

    # Exporte dans le bon format, dans un dossier temporaire à côté de l'emplacement final.
    export:
      label: "Export"
      index: 50
      commands:
        export_ma:
          label: "Export as ma"
          path: "silex_maya.commands.export_ma.ExportMa"
          parameters:
            directory:
              value: !command-output "setup:build_output_path:temp_directory"
              hide: true
            file_name:
              value: !command-output "setup:build_output_path:file_name"
              hide: true

    # Déplace le fichier exporté de l'emplacement temporaire à l'emplacement final
    move:
      label: "Move"
      index: 60
      commands:
        move:
          label: "Move"
          path: "silex_client.commands.move.Move"
          parameters:
            src:
              value: !command-output "export:export_ma"
              hide: true
            dst:
              value: !command-output "setup:build_output_path:directory"
              hide: true
        remove:
          label: "Remove temp directory"
          path: "silex_client.commands.remove.Remove"
          parameters:
            file_path:
              value: !command-output "setup:build_output_path:temp_directory"
              hide: true

    # Invite l'utilisateur à prévisualiser l'image dans l'explorateur Silex.
    preview:
      label: "Upload Preview"
      index: 70
      commands:
        step_exit:
          label: "Prompt preview"
          path: "silex_client.commands.exit_step.ExitStep"
          parameters:
            enable:
              label: "Skip preview capture"
              value: false
          ask_user: True

        capture_preview:
          label: "Capture preview"
          path: "silex_maya.commands.capture_preview.CapturePreview"

        upload_preview:
          label: "Upload preview"
          path: "silex_maya.commands.upload_preview.UploadPreview"
          parameters:
            preview_path:
              value: !command-output "preview:capture_preview:thumbnail"
              hide: true
```

Comme vous pouvez le voir, il y a plusieurs étapes que le publish, comme le contrôle de conform, comme mentionné précédemment, et la capture d'aperçu.

Parfois, vous pouvez voir un chemin avec un root **setup** comme : `"setup:build_output_path:directory"`

Cela fait référence au fichier publish.yaml dans le repository [silex_client](../Client/client.md), qui appelle le YAML spécifique (dans ce cas ma.yaml) dans le repository plugin. Dans notre exemple, avant d'exécuter le fichier ma.yaml, le fichier publish exécute un tas d'autres commandes, dont la plus importante est **build_output_path**.

Voici le fichier publish.yaml dans **silex_lcient/command/config/action/** :

```yaml title="publish.yaml"
publish: !inherit
  parent: ".pull"
  shelf: "output"

  thumbnail: "publish.svg"
  steps:
    setup:
      lavel: "Setup"
      index: 50
      commands:
        get_publish_type:
          label: "Select publish type"
          path: "silex_client.commands.select_publish.SelectPublish"
          tooltip: "Select the type of publish you want to make"
          ask_user: true
        build_output_path:
          label: "Build output path"
          path: "silex_client.commands.build_output_path.BuildOutputPath"
          tooltip: "Build the complete output path"
          ask_user: True
          parameters:
            output_type:
              value: !command-output "setup:get_publish_type:publish_type"
              hide: true
            use_current_context:
              value: true
              hide: true
            task:
              hide: true
            frame_set:
              hide: true
            name:
              value: "main"
              label: "Publish name"

    pull:
      index: 100
      commands:
        select_pull:
          parameters:
            prompt: true
            publish:
              value: !command-output "setup:build_output_path:directory"
              hide: true

    insert:
      index: 150
      hide: true
      commands:
        append_publish_actions:
          label: "Append selected publish action"
          path: "silex_client.commands.insert_action.InsertAction"
          tooltip: "Append the selected publish to the list of commands to execute"
          parameters:
            category: "publish"
            action:
              value: !command-output "setup:get_publish_type:publish_type"
              hide: true

    silex_coins:
      index: 500
      hide: true
      commands:
        add_silex_coins:
          path: "silex_client.commands.user.silex_coins.AddSilexCoinsCommand"
```

La commande **build_output_path.py** retourne le chemin de sortie du publish en suivant la convention de nommage.

## Rédigez votre propre publish : 🏆

Habituellement, pour implémenter un nouveau publish, vous pouvez écrire une nouvelle [commande](../Client/command-definition.md) pour exporter votre format et utiliser cet exemple YAML comme template. Vous n'avez qu'à changer la [commande](../Client/command-definition.md) dans l'étape **Export** pour le nom de votre nouvelle [commande](../Client/command-definition.md) d'export.

:::tip 🦉
Dans de nombreux cas, une commande exportera le fichier published vers un dossier temporaire passé à partir du chemin **build_output_path**. Par la suite, il devra passer le ou les fichiers nouvellement crées à l'étape de déplacement afin que la fonction de déplacement puisse les copier à l'emplacement final.
**Ainsi, les exigences de commande sont :**

1- Prendre un répertoire export comme paramètre.

2- Retourne la liste de tous les fichiers dans le dossier temporaire.
:::

Si vous le souhaitez, vous pouvez personnaliser ce template de publish en ajoutant ou en supprimant des étapes.

Si vous n'avez pas lu la documentation sur la définition de YAML, vous pouvez cliquer ici [action definition](../Client/action-definition.mdx). 🧭
