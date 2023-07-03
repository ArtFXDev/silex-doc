---
id: custom-plugin
title: Custom Plugin
sidebar_position: 30
---

# Plugin Infos and the Deadline API

"Plugin Infos" are additional pieces of information that can be provided when submitting a job to Deadline, in addition to the parameters defined in the plugin’s **.param file**. These information can vary depending on the type of job you are submitting and the plugin you are using.

For example, for a Maya render job, you might provide Plugin Infos such as the version of Maya to be used, the path to the scene file, the name of the camera to be used for rendering, etc. These Plugin Infos are then available to the plugin when it executes the render job.

The Deadline API allows you to access the Plugin Infos and plugin parameters. For instance, you can use the **GetPluginInfoEntry()** method to retrieve the value of a specific Plugin Info, or the **GetBooleanPluginInfoEntryWithDefault()** method to retrieve the value of a Plugin Info that is a boolean, with a default value if the Plugin Info is not set.

Here's an example of code that uses the Deadline API to access Plugin Infos:
```py
class MyPlugin( DeadlinePlugin ):

    def InitializeProcess( self ):
        # Retrieve the Maya version from the Plugin Infos
        mayaVersion = self.GetPluginInfoEntryWithDefault( "MayaVersion", "2022" )
        self.LogInfo( "The Maya version is %s" % mayaVersion )

    def RenderTasks( self ):
        # Retrieve the path to the scene file from the Plugin Infos
        sceneFile = self.GetPluginInfoEntry( "SceneFile" )
        self.LogInfo( "The scene file is %s" % sceneFile )

```
In this example, the plugin retrieves the Maya version and the path to the scene file from the Plugin Infos, then logs them.

The Deadline API also offers other methods to interact with the Deadline system, like **LogInfo()** to log information, **FailRender()** to fail a render with an error message, **GetJob()** to get information about the current job, etc. This allows plugins to flexibly control the rendering process and interact with the Deadline system.