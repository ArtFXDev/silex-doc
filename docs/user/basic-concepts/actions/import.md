---
id: import
title: Import/Reference
sidebar_position: 30
---
This action lets you import publish into your scenes. Instead of going to the server and importing your files by hand, you simply tell silex which task you want to import.

## In Houdini
![](../../../../static/img/user_guide/actions/houdini_shelf/houdini_silex_shelf_import.png)                         
From your houdini work file, simply go to the silex shelf and click on the import button.
At this moment you can import as :
- Geometry
- Alembic scene
- Arnold Procedural
- Arnold Volume
Send a [ticket](../../interface/tickets.md) to the TD Gang if you need another type of import.

![](../../../../static/img/user_guide/actions/import/import_in_houdini.gif)             
Choose the file you want to import.
If it is a image sequence, keep activate the toggle **Files sequence**.
**Import as** allows you to choose the import type. In this example I import .begeo.sc so I keep *Geometry*.
![](../../../../static/img/user_guide/actions/import/imported_in_houdini.png)
My image sequence was successfully imported.


## In Maya
![](../../../../static/img/user_guide/actions/maya_shelf/maya_silex_shelf_import.png)                       
From your maya work file, you can find the import button and the reference button.                  
To exploit the power of the pipeline to its full potential, import as a reference rather than importing at all.

![](../../../../static/img/user_guide/actions/import/import_in_maya.gif)                           
Choose the file you want to import.                 
We recommend that you choose a namespace.  
