---
id: action-execution
title: Action execution
sidebar_position: 10
---

An action is a set of instructions that will be executed sequentially. To learn more about them, read the user guide page about actions.

## Executing actions from CLI

This is the simplest way of executing an action. Once silex is installed, run ``silex action <action-name>``.
If you installed silex core as a rez package, don't forget to execute this command in the rez environment: ``rez env silex_client -- silex action <action-name>``

Some action behaves differently according to the context you are executing them from (for example, the publish will set the publish location using the current task defined in the context).
You can specify the task using the ``--task-id`` argument with the ID if the entity in the cgwire database.

Silex actions sometimes prompt the user with parameters. You can set parameters ahead with the ``--parameters`` argument. The expected value is ``<parameter-path>=<parameter-value>`` the parameter will be automaticcaly casted into the expected type of the parameter. To set multiple parameters just use this argument multiple times.

Sometimes you want to execute actions in headless mode (on the renderfarm or on ssh), in this case you don't have access to the silex UI and when the user will be prompted, the action execution will be stuck waiting for an input in the UI. To prevent that you can use ``--batch`` to tell silex to not try to connect to the UI via websocket. All the parameters that require a user input will keep their default values.

To get more information about the silex core CLI, use ``silex action --help``
