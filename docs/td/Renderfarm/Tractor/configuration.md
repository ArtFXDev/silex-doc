---
title: Configuration
sidebar_position: 20
---

The configuration files of Tractor are located in `/opt/pixar/Tractor-<major>.<minor>`.

There is a GitHub repository on ArtFXDev storing the configuration for the year 2022: https://github.com/ArtFXDev/tractor-config

You can also check the 2021 configuration: https://github.com/ArtFXDev/tractor-2020

## `tractor.config`

Global settings for the engine.

Some useful settings to change:

- `EngineOwner`: change the service owner of the process (better as non-root user)
- `EngineDiscovery`: DNS settings for blades when querying the engine, leave it blank to not multicast (can flood the network otherwise)
- `SiteCmdLogRetrievalURL`: url to retrieve the logs (see [blade logging](#blade-log-access))
- `SiteMaxListReplyCount`: limit the number of list records you can get from the API
- `JobSchedulingMode`: change the job scheduling mode (we mainly use `P+ATCL+RR`, see the [docs](https://rmanwiki.pixar.com/display/TRA/Scheduling+Modes))
- `CmdAutoRetryAttempts`: set the number of auto retry for commands that fail
- `CmdAutoRetryStopCodes`: exclude return code from auto retrying the task (useful when you know that there's a fatal error)
- `EngineWorkerThreads`: set the number of threads and workers of the engine (advised to be: `10 + (number_of_blades / 100)`)

## `blade.config`

Describes the blade profiles (group of computers).

:::info
The profiles are exclusive and assigned from top to bottom. Use the `Provides` list to assign multiple tags to blades instead.
:::

Here is an example of a profile matching blades that have a `NVIDIA` GPU:

```json
// blade.config
{
  "ProfileName": "GPU",
  "Hosts": {
    "GPU.label": ["NVIDIA GeForce*"]
  },
  "Provides": ["GPU"],
  "PathExists": [
    "C:/Maya2022/Maya2022/vray/bin/vray.exe",
    "C:/Nuke13.0v3/Nuke13.0.exe",
    "C:/Maya2022/Maya2022/bin/render.exe",
    "C:/Program Files/Autodesk/Arnold"
  ],
  "EnvKeys": ["@merge('shared.windows.envkeys')"]
}
```

:::tip
For more information, see the official [documentation](https://rmanwiki.pixar.com/display/TRA/Server+Profiles)
:::

### Blade log access

From the [documentation on logging](https://rmanwiki.pixar.com/display/TRA/Logging#Logging-directwritesLoggingCommandOutputtoaCentralFileserver):

> Logging Tractor command output to a central fileserver should be considered a best-practice technique, especially for large production sites.

> Writing directly to a high-performance network share using "local" file operations can be nearly as good, and provides many additional benefits in terms of log access and management.

> There are several benefits to using a standard web server to deliver these command logs to Tractor Dashboard, and other requestors. The first is that it can offload this type of file i/o from Tractor Engine itself. More importantly, it can also allow users to browse logs directly from a generic web browser by simply traversing the job directory listings delivered by the web server. Obviously, the underlying shared fileserver itself provides similar access to logs from arbitrary utilities and scripts using plain file read operations.

In the `ProfileDefaults` object, we changed the following key to indicate to the blades where they should write the logs.

```json
// blade.config
{
  "ProfileDefaults": {
    "CmdOutputLogging": "logfile=//prod.silex.artfx.fr/tractor_logs/%u/J%j/T%t.log"
  }
}
```

To do that the folder needs to be accessible as a Samba network location with write access.

Also change the configuration to retrieve the logs in the `tractor.config` file to be the URL of the web server hosting the static files:

```json
// tractor.config
{
  "SiteCmdLogRetrievalURL": "http://prod.silex.artfx.fr:8001/%u/J%j/T%t.log"
}
```

## `crews.config`

Specify Administrator, Wrangler and ValidLogins.

- `Administrator` -> can reload the configuration on the interface
- `Wrangler` -> can modify others jobs (useful for team's tech lead)
- `ValidLogins` -> for NIMBY authentication

:::info
To use the custom user authentication, specify it:

```json
{
  "SitePasswordValidator": "python3 ${TractorConfigDirectory}/trSiteLoginValidator.py"
}
```

:::

## `limits.config`

Specify limits for tasks and jobs on the render farm. You can limit a certain type of job to run only on max X machines.

You also specify limits to how much a project can use the farm.

> See: https://rmanwiki.pixar.com/display/TRA/Limits+Configuration

:::note
Job priorities are sometimes more effective than limiting a project to a maximum percentage usage on the farm.
:::

## `shared.xxxxx.envkeys`

List of environment variables than can be included in the `blade.config` profile configuration.

An example file can be:

```json
// shared.windows.envkeys
[
  {
    "keys": ["default"],
    "environment": {
      // Rez configuration file location on the network
      "REZ_CONFIG_FILE": "//192.168.2.112/rez/windows/config/rezconfig.py",

      // Ana and tars username and password
      "SERVER_USER": "xxxxxx",
      "SERVER_PASS": "xxxxxx",

      // Software license server location
      "foundry_LICENSE": "4101@centlic",
      "ADSKFLEX_LICENSE_FILE": "2080@winlic"
    },
    "envhandler": "default"
  }
]
```

Then use it everywhere on the profiles to inherit from those:

```json
// blade.config
{
  "BladeProfiles": [
    {
      "ProfileName": "DEV",
      "EnvKeys": ["@merge('shared.windows.envkeys')"]
    }
  ]
}
```

## `trSiteLoginValidator.py`

Allows us to authenticate to the Zou backend for user managment.

We make a request to the API by providing the raw user and password.

```python
# trSiteLoginValidator.py
#!/usr/bin/env python

import requests
import sys

def main ():
    user = input()
    challenge = input()
    pw_hash = input()

    # Allow the nimby to eject jobs
    if user == "nimby":
        return 0

    r = requests.post(
      "http://kitsu.prod.silex.artfx.fr/api/auth/login",
      {"email": f"{user}@artfx.fr", "password": pw_hash}
    )

    return 0 if r.status_code == 200 else 1;

if __name__ == "__main__":
    rc = main()

    if 0 != rc:
        sys.exit(rc)
```

:::info
Notice the `"nimby"` special login for the NIMBY to connect without password to the engine
:::

:::caution
The passwords are not currently hashed so they might be stored in clear text in the database...
:::
