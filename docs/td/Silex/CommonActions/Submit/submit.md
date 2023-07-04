---
title: Submit
---

**Submit** is the action of launching a job on the [render farm](../../../Renderfarm).

## Purpose

The goal of the submitter is to be able to launch render jobs with **different render engines** and tools.

It must be **flexible** enough to construct different kind of commands used for rendering.

We currently support:

- V-Ray `.vrscene` files
- [Husk](https://www.sidefx.com/docs/houdini/ref/utils/husk.html) (render USD files with Houdini's Karma or other Hydra delegate)
- [Kick](https://docs.arnoldrenderer.com/pages/viewpage.action?pageId=36110428) (Arnold command line) `.ass` sequences
- Houdini scenes `.hip*`
- Maya scenes `.ma/mb`
- Nuke scripts `.nk` (WIP)

## Architecture

This is an example of the **V-Ray** submitter:

![](/img/silex/vray_submit_action.jpg) ***TODO: update picture***

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
					    - 
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
							
				submit_to_deadline:
					label: "Submit"
					path: "silex_client.commands.farm.submit_to_deadline.SubmitToDeadlineCommand"
					ask_user: true
						parameters:
							jobs:
								value: !command-output "vray_render:build_vray_tasks:jobs"     
								 
				submit_movie:
					label: "Generate a movie by job"
					path: "silex_client.commands.farm.natron_movie_render_tasks.SubmitNatronMoviesCommand"
					ask_user: True
					parameters:
						jobs:
							value: !command-output "vray_render:submit_to_deadline:jobs"
```

</p>

</details>

The steps are:

**submit.yml:**
1. We launch the action defined by `submit.yml`. This is the base action.
2. `append_submit_actions` is using the [`InsertAction`](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/insert_action.py#L21) command to insert the appropriate submitter based on the user input. We specify the `submit` category to look at the [`config/submit/xxxx.yml`](https://github.com/ArtFXDev/silex_client/tree/dev/silex_client/config/submit) submitter action definitions.
3. The submitter is inserted so vray.yml is executed.

**vray.yml**:
1. 'build_output_path' builds the output path of the image files for the render.
2. In 'vray_render', first we call the renderTaskCommand. It will display the different options we need to construct the Job object. For vray, it's ```commands/farm/vray_render_task.py->VrayRanderTask``` that create a VrayJob ```utils/deadline/job.py->VrayJob``` A list of Job is return.
3. In 'submit_to_deadline', each job in the list will be converted into the 'plugin_infos' and 'job_infos' dictionaries required by the Deadline API. These jobs will then be sent to the farm. 
4. Finally, 'submit_movie' allows the user to request a final job that will render a movie of the frames rendered once the first jobs have finished. This jobs will depends of the previous jobs.
