---
id: blade-tractor
title: Blade Tractor
---


# Presentation
Ce scripts déploy le service tractor sur la machine local.

# Contenu

```py
# update_tractor_blade.ps1
$fileA = "C:\Program Files\Pixar\Tractor-2.4\lib\python2.7\Lib\site-packages\tractor\apps\blade\TractorSiteStatusFilter.py"
$fileB = "\\prod.silex.artfx.fr\rez\windows\TractorSiteStatusFilter.py"

$files = Get-ChildItem "\\prod.silex.artfx.fr\rez\windows\blade_tractor\blade" -Filter *.py
$restart = $false

for ($i=0; $i -lt $files.Count; $i++) {
	$filename = $files[$i]
	$source = $files[$i].FullName
	$destination = "C:\Program Files\Pixar\Tractor-2.4\lib\python2.7\Lib\site-packages\tractor\apps\blade\$filename"
	
	if (Compare-Object -ReferenceObject $(Get-Content $source) -DifferenceObject $(Get-Content $destination)) {
		Write-Output "$destination modified"
		Copy-Item $source -Destination $destination -force
		$restart = $true
	}
}

if ($restart) {
  Write-Output "Restarting blade"
  Restart-Service -Name "Pixar Tractor Blade Service 2.4"
  New-Item -Path \\prod.silex.artfx.fr\rez\windows\blade_tractor\status\updated -Force -Name $env:computername
} else {
  Write-Output "Blade up to date"
  New-Item -Path \\prod.silex.artfx.fr\rez\windows\blade_tractor\status\uptodate -Force -Name $env:computername 
}
```

Attention, si ce script est lancé 2fois de suite sur une meme machine, le services tractor s'arrête !
Dans ce cas, pour relacer le service tractor nous avons créé un second scripts

```py
# reset_status.ps1
Set-Itemproperty -path 'HKLM:\SYSTEM\CurrentControlSet\Services\Pixar Tractor Blade Service 2.4' -Name 'Start' -value '2'
Set-Service -Name "Pixar Tractor Blade Service 2.4" -Status Running -PassThru
New-NetFirewallRule -DisplayName 'TractorBlade' -Profile Any -Direction Inbound -Action Allow -Protocol TCP -LocalPort @('9005')
```
