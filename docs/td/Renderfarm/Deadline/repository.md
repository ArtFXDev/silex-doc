---
title: Deadline repository
sidebar_position: 20
---

## What is it?
The Deadline repository (or "Repo") acts as the control center for your render farm. It stores all information about render jobs, machines in the render pool, software settings, etc.

To access the repository, you need to configure the repository path in the Deadline client software. This path can be a local network path or a URL for repositories hosted on the cloud.

Once connected, you can see the list of all render jobs, their status, assigned machines, and other relevant information. You can control render jobs, reassign tasks, and adjust software settings directly from the repository interface.

## Plugins
Thinkbox Deadline offers the possibility to create custom plugins to extend its functionalities. These plugins can be written in Python or .NET and can interact with the Deadline system via the Deadline API. With silex, we use Python.

A plugin is necessarily composed of 2 files:
- A **.param file** which defines the expected parameters (plugin infos) for the use of the plugin.
- A **plugin name.py** file that will be executed when using the plugin and will convert the job parameters into commands sent to the workers.
These files can be complemented by the plugin icon that will be displayed in the Deadline Monitor.

### Custom plugin
In addition to the standard plugins provided by Thinkbox, users can also create their own custom plugins. This allows users to extend the functionalities of Deadline and adapt it to their own rendering pipelines. These plugins are located here: **Your Repository Path/plugins/custom/plugin name**.

Here is the Artfx current custom plugins :
-   Vray
-   Arnold
-   Houdini
-   Husk
-   MayaBatch

wip:
-   Nuke
Repo findable [here](https://github.com/ArtFXDev/deadline_rez)

More information to [develop custom Deadlin plugins](./custom-plugin)
