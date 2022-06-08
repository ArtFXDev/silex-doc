---
id: commonactions
title: Common Actions
sidebar_position: 30
---

Some actions are common to all DCCs. They are implemented in `Silex Client` directly, and then
customised for each DCCs thanks to the context.

:::info
Actions are defined with YAML files. If you don't know how to defined an action yet see the [action definition page](../Client/action-definition.mdx)
:::

## Action insertion

One common point to these actions is that they all insert actions at runtime
using the [insert action command](https://github.com/ArtFXDev/silex_client/blob/dev/silex_client/commands/insert_action.py)
This command will resolve the specified actions and insert all of its steps and commands right after the current step.
This allows to have an action that dynamically adapt while its executing.

![](/img/silex/silex_insert_action.gif)

To separate the actions that are meant to be inserted and the ones to be executed directly, we use [categories](../Client/action-definition.mdx#where-do-i-place-my-yaml-)
For example, the publish action will allow the user to insert an action among the possible ones present in the `publish` category. You can make some publishes accesible
in some [contexts](../Client/context.md) or not by defining your publishes in the plugin you want.
