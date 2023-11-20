---
title: Installation
sidebar_position: 10
---

Tractor was meant to be installed on a [RHEL](https://en.wikipedia.org/wiki/Red_Hat_Enterprise_Linux) based Linux distribution like [CentOS](https://en.wikipedia.org/wiki/CentOS) which is commonly used in VFX studios. But this guide include instructions to install it on a Debian based machine.

### Install RPM packages

The package that you get from the [download page](https://renderman.pixar.com/forum/download.php) is a [`.rpm`](https://en.wikipedia.org/wiki/RPM_Package_Manager) package which you can only install on RHEL distros.
However if you plan to install it on a [Debian](https://en.wikipedia.org/wiki/Debian) based machine, the setup is a little bit different.

To convert a `.rpm` to a `.deb` package, use [Alien](https://github.com/mildred/alien):

```shell
$ sudo apt install alien

# Convert to .deb with scripts (-c option)
$ sudo alien -d -c Tractor-2.4_2091325-linuxRHEL6_gcc44icc150.x86_64.rpm

# Installs the generated deb package using low level dpkg
$ sudo dpkg -i tractor_2.42091325-1_amd64.deb
```

:::info
Repeat this process for the Pixar License server (License Utilities) to install the license. (for example `PixarLicense-LA-24.0_2172149-linuxRHEL7_gcc63icc190.x86_64.rpm`)
:::

### License server

To install the license server, do the following (after installing the package):

```shell
$ cd /opt/pixar/PixarLicense-LA-24.0
$ sudo ./linux_installService.sh
```

:::caution
You must have a `pixar.license` file in the `/opt/pixar` directory for the install to work.
:::

### Setup systemd service files

Now the issue is that the [systemd](https://en.wikipedia.org/wiki/Systemd) services are not installed and configured. It allows the service to start/restart at boot time.
See Pixar's documentation about [setting up the services](https://rmanwiki.pixar.com/display/TRA/Setting+Up+Services).

The systemd service files are located in `/opt/pixar/Tractor-2.4/lib/SystemServices`. Copy those files in the right folder and start the services:

```shell
# Copy service file in systemd directory
$ sudo cp /opt/pixar/Tractor-2.4/lib/SystemServices/systemd /etc/systemd/system
$ sudo systemctl start tractor-engine.service

# Checks if it's running
$ sudo systemctl status tractor-engine.service
```

:::note
You can change the line `Environment="OPTIONS=--debug --log /home/td/tractor/engine.log"` in `tractor-engine.service` to add a custom log location.
:::

### DNS setup

There must be an entry in the DNS server of `tractor` and `tractor-engine` pointing to the server. It allows future blades and services to connect to the engine.

To verify if it works, you can use `nslookup`:

```shell
$ nslookup tractor
Server:         172.16.69.160
Address:        172.16.69.160#53

Non-authoritative answer:
Name:   tractor.artfx.fr
Address: 192.168.2.120
```

### Connect to the dashboard interface

If everything works as expected, you can go to `http://tractor` on a browser to inspect the Tractor interface.

Congratulations! Tractor is running fine 🚜🚜
