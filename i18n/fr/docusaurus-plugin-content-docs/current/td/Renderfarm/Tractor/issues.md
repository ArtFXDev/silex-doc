---
title: Issues and solutions
sidebar_position: 30
---

## Properly killing a task on Windows

On the render farm, we use [Rez](https://github.com/AcademySoftwareFoundation/rez). Rez is very handy but the problem is that when launching a command, it spawns a subprocess in a sub shell.

This is problematic when Tractor or the NIMBY want to kill the process on a Blade because the visible PID is Rez's one, not the worker process. So we ended up killing Rez and the V-Ray process was still running on the machine...

You can read additional details on this GitHub discussion: https://github.com/AcademySoftwareFoundation/rez/discussions/1250

The solution was to modify the blade code specifically on Windows to kill the process tree using `Powershell`:

```python
# TrSubprocess.py

def send_signal(self, sig):
  if subprocess.mswindows:
    subprocess.call(['taskkill', '/F', '/T', '/PID', str(self.pid)])
```

See the patched files here: https://github.com/ArtFXDev/tractor-blade-patch

:::info
This approach is also used on the user side with the NIMBY running in `silex-desktop`. It sends a request to the `silex_GoKillProcess`, a special service running on every computer used to kill a pid in system session:

- https://github.com/ArtFXDev/silex_GoKillProcess/blob/a03a61f31beddc714d87483b51d7ee3fd1391110/utils/terminate.go#L8
- https://github.com/ArtFXDev/silex-desktop/blob/3676ba99a58f4951ad1cdaad408883448114d31b/src/utils/blade.js#L47

:::

:::note
It seems to fix this issue I posted: https://renderman.pixar.com/forum/showthread.php?s=&threadid=45707 (multiple task owners even if max slots is at 1)
:::

## The `"No Free Slots"` problem

The `No Free Slots` issue is a classic in ArtFX's pipeline history (hi Sylvain and Bruno).

By default every blade on the farm has a max slot capacity of `1` which means it can only run up to `1` task concurrently. When it happens, the `note` field of the blade changes to `no free slots (1)` which means that the blade can't accept another task.

The issue we saw rising was blades that had the no free slots thing even thought **no tasks were running on the blade**.

We hard fixed that by killing specific process names on the affected blades in [Harvest](../harvest):

https://github.com/ArtFXDev/harvest-api/blob/master/src/schedule/nofreeslots.ts

```js
export async function clearNoFreeSlots() {
  const blades = await getNoFreeSlots();

  blades.forEach(async (b) => {
    const result = await getProcessesQuery(b.addr);
    const processesToKill = ["rez", "maya", "hrender", "kick", "vray"];

    processesToKill.forEach(async (p) => {
      const process: ResultGoKillProcess = result?.data.find(
        (tp: { Name: string }) => tp.Name.toLowerCase().includes(p)
      );
      if (process) await killProcessesQuery(b.addr, process.PID);
    });
  });
}
```

## Running multiple commands on the same blade

A task has multiple commands. You might think that one task means one computer and so commands are executed on the same blade, **you are wrong!**.

Since we want to mount the project's NAS before doing any rendering we want to do this in two commands. For a long time we had issues because it was mounting the network drive on another machine and therefore it didn't have access to the published files...

We also had blades blocked because they were going NIMBY ON between the two commands.

See this thread for more information: https://renderman.pixar.com/forum/showthread.php?s=&threadid=45603

Currently this problem is solved using a command wrapper I wrote in Rust (to learn the language, if you want too [do it in Python](https://github.com/ArtFXDev/silex-rez/tree/prod/packages/utils/command_wrapper) it shouldn't be to hard):

https://github.com/johhnry/cmd-wrapper/

It's compiled as an `.exe` and put on the network in the Rez packages.

It allows us to do the following in a single command:

```shell
rez env cmd_wrapper -- cmd-wrapper
  --pre="rez env mount_render_drive -- mount_rd_drive ana"
  --cmd="rez env houdini pek -- hython -m hrender
        scene.hip
        -d surface_reflec
        -o out.$F4.exr
        -v -S
        -f 1001;1002;1003;1004;1005;1006;1007;1008"
```

By passing commands as strings it will launch all the `--pre` commands, the `--cmd` command and then even if it fails, the `--post` commands.

It also solves this issue I posted: https://renderman.pixar.com/forum/showthread.php?s=&threadid=45739 (about adding a task cleanup on Tractor using `task.addCleanup`)

## Clear blade data

:::caution
Be careful when right clicking on the blades in the interface and pressing `"Clear earlier blade data"` because it might put all the blades in `No Free Slots` mode instantly when **doing it on a large amount of blades**.

Filed this bug here: https://renderman.pixar.com/forum/showthread.php?s=&threadid=45857
:::
