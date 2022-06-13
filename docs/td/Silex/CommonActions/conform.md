---
id: conform
title: Conform
---

The conform is used to move a file from outside of the pipeline into the pipeline.
It first checks all the possible dependencies of that file (textures, references...)
and make sure that the file and all its dependencies are accessible on the pipeline.

## Purpose

The conform is different according to the type of file. We can split these filetypes into two categories :

- The file that cannot have external file dependencies (like a PNG file)
- The file that might have external file dependencies (like a houdini scene file)

:::tip
The first category is the simplest, there is almost nothing to do to implement a new file type
that cannot have external file dependencies. However the first category needs special treatment.
:::

The conform can be separated into 6 steps:

1. Select a file to conform
2. Build the output path for that file
3. Find all the dependencies of the file that are not on the pipeline
4. Call the conform for each dependency found
5. Repath the dependencies to their new conformed path
6. Move the file to its output location

When you implement a new conform, you will have to implement the step `3` and `4` because the way these steps are
implemented is usually specific to each types of file.

One important part is that on step `4` the conform calls an other conform on each dependencies of the file,
which makes the conform recursive.

:::info
In the case of a file type that cannot have external dependencies, these steps does not exists,
that's why they are so easy to implement.
:::

## Architecture

This is an example of the Maya conform:

![](/img/silex/vray_conform_action.jpg)

- The user execute the conform and select a maya scene file.
- The maya conform is inserted, and the output path of that maya scene is built
- We find all the dependencies of that maya scene that are not on the pipeline
- For each one of these dependencies, we insert an other conform for each dependencies (only one PNG conform is shown here)
- We gather all the new path and repath all the dependencies of the maya scene to make them point to their new location
- We copy the maya scene file to its new location and rename it correctly

:::info
In this example we only see that one png conform has been inserted for simplicity. In reality, one png conform will
be inserted for each png that needs to be conformed. Same goes for all the external dependencies like VDBs, alembics...
The final action might end up very big for big scenes with a lot of dependencies.
:::

:::caution
In this example we have a depth of 2 (a file that references an other file) but since maya scene files can reference
other maya scene files, the depht might go very deep.
:::

## Write your own conform

When you execute the conform action, the first step is to select the file you want to conform and then an appropriate conform will be inserted.
When inserting the appropriate conform, the command will look for yaml files into the `conform` category. So your conform implementation
needs to be in a `conform` folder of an `SILEX_ACTION_CONFIG` location (see the action definition section).

The command can auto selecte the conform using the extention of the given file, for that to work your conform must have the same
name as the extension it is made for. For example if you implement a conform for USD files you should organize your file like this:

```
📦config
 ┗ 📂conform
   ┗ 📜usd.yml
```

### File that cannot have external dependencies

These files do not need any special treatment, all you have to do is inherit from the conform called `default` and
override the `output_type` parameter of the `build_output_path` command:

```yml
vdb: !inherit
  parent: ".default"

  steps:
    conform:
      commands:
        build_output_path:
          parameters:
            output_type:
              value: "vdb"
```

### File that might have external dependencies

WIP

:::tip
If you check the yaml files of the default conform, you will see that they are actually more steps than shown in the architecture.
These steps are only to store globaly the conformed files, and prevent conforming the same file again if it is
referenced multiple times.
:::

:::caution
The **.ass conform** action is using a Maya Arnold api wich is only accessible from Maya. So **.ass** files need to be conform from the shelf of an open maya scene !
:::

