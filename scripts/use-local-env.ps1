# Dot-source this file before commands that may create caches or temporary files.
$projectRoot = Split-Path -Parent $PSScriptRoot

$localDirectories = @(
    (Join-Path $projectRoot ".tmp"),
    (Join-Path $projectRoot ".cache"),
    (Join-Path $projectRoot ".cache\npm"),
    (Join-Path $projectRoot ".cache\pip"),
    (Join-Path $projectRoot ".cache\playwright"),
    (Join-Path $projectRoot ".artifacts")
)

foreach ($directory in $localDirectories) {
    New-Item -ItemType Directory -Force -Path $directory | Out-Null
}

$env:TEMP = Join-Path $projectRoot ".tmp"
$env:TMP = $env:TEMP
$env:NPM_CONFIG_CACHE = Join-Path $projectRoot ".cache\npm"
$env:PIP_CACHE_DIR = Join-Path $projectRoot ".cache\pip"
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $projectRoot ".cache\playwright"
$env:PYTHONPYCACHEPREFIX = Join-Path $projectRoot ".cache\python"

Write-Host "Project-local cache and temp paths are active: $projectRoot"
