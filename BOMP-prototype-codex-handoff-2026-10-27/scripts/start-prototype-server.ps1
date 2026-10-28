param(
    [ValidateRange(1, 65535)]
    [int]$Port = 4173,

    [string]$BindAddress = "127.0.0.1"
)

$projectRoot = Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot "use-local-env.ps1")

$node = Get-Command node -ErrorAction SilentlyContinue
$python = Get-Command python -ErrorAction SilentlyContinue
$pythonLauncher = Get-Command py -ErrorAction SilentlyContinue

if (-not $node -and -not $python -and -not $pythonLauncher) {
    throw "No supported runtime was found. Install Node.js or Python 3 and ensure it is available on PATH."
}

$url = "http://${BindAddress}:$Port/pages/prototype-suite/home.html"
Write-Host "BOMP prototype server: $url"
Write-Host "Press Ctrl+C to stop the server."

Push-Location $projectRoot
try {
    if ($node) {
        & $node.Source (Join-Path $PSScriptRoot "serve-prototype.js") $Port $BindAddress
    } elseif ($python) {
        & $python.Source -m http.server $Port --bind $BindAddress
    } else {
        & $pythonLauncher.Source -3 -m http.server $Port --bind $BindAddress
    }
} finally {
    Pop-Location
}
