---
title: Submit
---

**Submit** est l'action de lancer un job sur la [render farm](../../../Renderfarm).

## Objectif

Le but du submitter est de pouvoir lancer des jobs de rendu avec **différents moteur de rendu (render engines)** et outils.

Il doit être suffisamment **flexible** pour construire différents types de commandes utilisées pour le rendu.

Nous soutenons actuellement :

- V-Ray `.vrscene` files
- Blender `.blend` files
- [Husk](https://www.sidefx.com/docs/houdini/ref/utils/husk.html) (rendu fichier USD avec Houdini Karma ou un autre délégué Hydra)
- [Kick](https://docs.arnoldrenderer.com/pages/viewpage.action?pageId=36110428) (ligne de commande Arnold) `.ass` sequences
- Houdini scenes `.hip*`
- Maya scenes `.ma/mb`
- Nuke scripts `.nk`

## Architecture

Voici  un exemple d'un submitter de **V-Ray** :

![](/img/silex/vray_submit_action.jpg)

<details><summary><code>submit.yml</code> définition de l’action</summary>

<p>

```yaml
submit:
  shelf: "output"
  thumbnail: "submit.svg"

  steps:
    setup:
      lavel: "Setup"
      index: 50
      commands:
        get_submiter:
          label: "Select submiter"
          path: "silex_client.commands.select_submit.SelectSubmit"
          tooltip: "Select the type of conform you want to make"
          ask_user: true

        append_submit_actions:
          label: "Append selected submit action"
          path: "silex_client.commands.insert_action.InsertAction"
          tooltip: "Append the selected submit to the list of commands to execute"
          parameters:
            category: "submit"
            action:
              value: !command-output "setup:get_submiter:action"
              hide: true

    silex_coins:
      index: 500
      hide: true
      commands:
        add_silex_coins:
          path: "silex_client.commands.user.silex_coins.AddSilexCoinsCommand"
          parameters:
            amount:
              value: 3
```

</p>

</details>

<details><summary><code>vray.yml</code>définition de l’action</summary>

<p>

```yaml
vray:
  label: "Submit V-Ray scene"
  steps:
    build_output_path:
      label: "Build output path"
      index: 10
      commands:
        select_extension:
          label: "Output extension"
          path: "silex_client.commands.select_list.SelectList"
          parameters:
            param_name: "Output extension"
            parameters_list:
              - "exr"
              - "png"
              - "jpg"
              - "tiff"

        build_output_path:
          label: "Build output path"
          path: "silex_client.commands.build_output_path.BuildOutputPath"
          tooltip: "Build the complete output path"
          ask_user: true
          parameters:
            output_type:
              value: !command-output "build_output_path:select_extension"
              hide: true
            create_temp_dir: false
            create_output_dir: false
            task:
              hide: true
            use_current_context:
              value: true
              hide: true
            frame_set:
              hide: true
            name:
              value: "render"

    vray_render:
      label: "Setup render parameters"
      index: 20
      commands:
        build_vray_tasks:
          path: "silex_client.commands.farm.vray_render_tasks.VrayRenderTasksCommand"
          label: "V-Ray Job parameters"
          ask_user: true
          parameters:
            output_directory:
              value: !command-output "build_output_path:build_output_path:directory"
            output_filename:
              value: !command-output "build_output_path:build_output_path:file_name"
            output_extension:
              value: !command-output "build_output_path:select_extension"

        submit_to_tractor:
          label: "Submit"
          path: "silex_client.commands.farm.submit_to_tractor.SubmitToTractorCommand"
          ask_user: true
          parameters:
            tasks:
              value: !command-output "vray_render:build_vray_tasks:tasks"
            job_title:
              value: !command-output "vray_render:build_vray_tasks:file_name"
            job_tags:
              value:
                - "vray"
```

</p>

</details>

Les étapes sont les suivantes :

1. Nous lançons l'action définie par `submit.yml`. C'est l'action de base
2. `append_submit_actions` utilise la commande [`InsertAction`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/insert_action.py#L21) pour insérer le submitter approprié en fonction de la saisie de l'utilisateur. Nous indiquons la catégorie de `submit` pour regarder les définitions d'action du submitter [`config/submit/xxxx.yml`](https://github.com/ArtFXDev/silex_client/tree/dev/silex_client/config/submit).
3. Le submitter est inséré et nous construisons le chemin de sortie des fichiers images pour le rendu
4. `build_vray_tasks` construit des tâches et des commandes en fonction de la `task_size` et d'autres entrées de l'utilisateur. Il renvoie une liste de tasks dans un [modèle de données abstrait](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/farm.py).
5. `submit_to_tractor` reçoit ces tasks et [les convertit dans son propre modèle de données Tractor](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/tractor.py#L14). Il [envoie ensuite le job](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/farm/submit_to_tractor.py#L130) avec l'utilisateur, les pools, les besoins en RAM et la priorité. Pour cela, nous utilisons notre propre [bibliothèque Python de Tractor](https://github.com/ArtFXDev/tractor_lib) mais patché pour Python 3.x.
