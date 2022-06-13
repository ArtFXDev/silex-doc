---
id: publish
title: Publish
---

---

## Intro:

The publish is one of the most improtant actions in Silex.

Every scene sent to the renderfarm must be in a publish folder (which is synchronised with the server : see [Silex introdution](../Silex.md)) as well as its references. This way, the _blades_ (computers in the renderfarm) can access all the files needed for rendering.

## Purpose :

The **Publish** action is the way to save your scenes and references in the **publish folder**. it exports multiple formats, checks that all references are in a publish folder and renames the exported file accordingly with the naming convention.

The purpose of the **publish** is to ensure that every job submited to the [Renderfarm](../../Renderfarm/renderfarm.md) is renderable, and all references and textures can be reached by any _blade_ on the network. For doing so, the action calls for the [Conform](./conform.md) action. If the references found in the scene need to be [conformed](./conform.md) to the pipeline, and cannot be accessed from the server. The **Publish** action will prompt you to [conform](./conform.md) these references.

### Step by step use of the publish :

1- Select a publish type.

2- Select or type a filename

3- Process parameters specific to the command called for the chosen publish type.

4- The comand exports the scene or the selection in a temporary folder.

5- A **move** command from silex_client is called to move the exported file to the right location.

---

## Architecture :

The publish allows you to export in a wide range of formats. you can find the list in the code in the folder:

- command
  - config
    - publish

(see for more info on repository architecture : [Plugins](../Plugins/Plugins.md)) 🧭

---

### Yummy YAMLs : 🎂

The publish [YAML](../Client/action-definition.mdx) file in the [silex_client](../Client/client.md) calls for other [YAML](../Client/action-definition.mdx)s from the **command/config/publish** folder in the plugin repositories. In here, [YAML](../Client/action-definition.mdx)s have the same name as the extension associated to the publish type.

For instance, in [silex_maya](../Plugins/Maya.md) in **command/config/publish** :

- publish
  - abc.yaml
  - ass.yaml
  - fbx.yaml
  - ma.yaml
  - ...
  - xgen.yaml

A publish [YAML](../Client/action-definition.mdx) file looks like this :

```yaml title="ma.yaml"
# the root has to have the same name as the YAML file.
ma:
  steps:
    # Look for references and check that everything is conform.
    # If not, use conform action
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

    # Export in the proper format, in a temporary folder next to the final location.
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

    # move exported file from temporary location to final location
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

    # Prompt user for a preview image in Silex explorer.
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

As you can see, there are multiple steps that the publish goes through, like the conform check, as mentioned before, and the preview capture.

Sometime, you can see a path with a **setup** root like : `"setup:build_output_path:directory"`

This refers to the publish.yaml file in the [silex_client](../Client/client.md) repository, that calls this the specific YAML (in this case ma.yaml) in the plugin repository. In the case of our example, before executing the ma.yaml file, the publish file executes a bunch of other commands, the most important of wich is the **build_output_path**.

Here is the publish.yaml in **silex_lcient/command/config/action/** :

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

The **build_output_path.py** command returns the output path of the publish following the naming convention.

## Write your own publish : 🏆

Usually, to implement a new publish, you can write a new [command](../Client/command-definition.md) to export your format and use this YAML example as a template. You only need to change the [command](../Client/command-definition.md) in the **Export** step to the name of your new export [command](../Client/command-definition.md).

:::tip 🦉
In many cases, a command will export the published file to a temporary folder passed from the **build_output_path**. Afterwards, it will need to pass the newly created file(s) to the move step so the move function can copy it/them to the final location.
**So, the command requirements are :**

1- Take an export directory as a parameter.

2- Return the list of all files in the temporary folder.
:::

If you want, you can customize this publish template by adding or deleting steps.

If you havn't read the documentation on the YAML definition, you can click here [action definition](../Client/action-definition.mdx). 🧭
