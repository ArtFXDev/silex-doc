---
id: submitter_silex
title: Submitter Silex
sidebar_position: 50
---
## Location
You can Submit to the renderfarm directly from your task in silex. Go to the task you want to submit, and click on the **Submit** button.
![](../../../static/img/user_guide/renderfarm/submitter_silex_btn.png)
## Action
![](../../../static/img/user_guide/renderfarm/submitter_silex_submitter_type.png)           
First, you need to choose wich submitter use :
- **Houdini** to submit .hip files.
- **Maya** to submit .ma files.
- **kick** to submit .ass files.
- **vray** to submit .vrscene files.
- **husk** to submit .usd files.

![](../../../static/img/user_guide/renderfarm/submitter_silex_extensions.png)               
Depending of the submitter you choose, you can specify wich kind of file you want to render.

![](../../../static/img/user_guide/renderfarm/submitter_silex_submitter_parameters.png)          
You need to specify wich file you want to submit to the farm and the frame range. Here is the nomenclature for the frame range : **{start frame}-{end frame}x{padding.}**. Example:
- 1001-1050x1 will render frame 1001 to 1050 every frame.
- 1010-1100x2 will render frame 1010 to 1100 every two frames (1010, 1012, 1014, etc.)
- etc.

Then, depending of the submitter you choose, you need to specify other parameters. For the houdini submitter (screenshot above), you need to specify the renderer (arnold, vray or mantra) and the ROP you want to render.

![](../../../static/img/user_guide/renderfarm/submitter_silex_job_infos.png)                
After that, the submitter needs the job informations. 
- **Groups**: You can choose a group of workers if you want to render on a particular group. If you want your jobs to be rendered on the whole farm, choose the group "none".
- **Pool**: Always on wspool.
- **Task size** : How many frames each tasks will render.
- **Priority** : Priority in the farm.
- **Delay submit** : If enabled, from your submit, jobs will be suspended for 5 minutes before being queued on the farm.

![](../../../static/img/user_guide/renderfarm/submitter_silex_generate_movie.png)
Finally, you can ask the submitter to convert the .exr rendered in a .mov.
Click on **CONTINUE** to submit your jobs.