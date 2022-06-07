---
title: Submit
---

**Submit** is the action of launching a job on the [render farm](../../Renderfarm).

## Architecture

This is an example of the V-Ray submitter:

<details><summary><code>submit.yml</code> action definition</summary>

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

<details><summary><code>vray.yml</code> action definition</summary>

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

![](/img/silex/vray_submit_action.jpg)

The steps are:

1. We launch the action defined by `submit.yml`. This is the base action
2. `append_submit_actions` is using the [`InsertAction`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/insert_action.py#L21) command to insert the appropriate submitter based on the user input. We specify the `submit` category to look at the [`config/submit/xxxx.yml`](https://github.com/ArtFXDev/silex_client/tree/dev/silex_client/config/submit) submitter action definitions.
3. The submitter is inserted and we build the output path of the image files for the render
4. `build_vray_tasks` constructs tasks and commands based on the `task_size` and other user input. It returns a list of tasks in an [abstract data model](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/farm.py).
5. `submit_to_tractor` receives those tasks and [convert them in Tractor's own data model](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/utils/tractor.py#L14). It then [sends the job](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/farm/submit_to_tractor.py#L130) with the user, pools, RAM requirement and priority. For that we use our own [Tractor's Python library](https://github.com/ArtFXDev/tractor_lib) but patched for Python 3.x.
