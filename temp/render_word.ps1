param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$PdfPath
)

$word = $null
$document = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $document = $word.Documents.Open($InputPath, $false, $true)
    foreach ($field in $document.Fields) {
        $field.Update() | Out-Null
    }
    $document.ExportAsFixedFormat($PdfPath, 17, $false, 0, 0, 1, 1, 0, $false, $false, 0, $false, $true, $false)
}
finally {
    if ($null -ne $document) {
        $document.Close($false)
        [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($document) | Out-Null
    }
    if ($null -ne $word) {
        $word.Quit()
        [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($word) | Out-Null
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
