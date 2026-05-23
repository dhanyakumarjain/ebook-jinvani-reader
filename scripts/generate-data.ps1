# PowerShell script to generate data.json from media folder

$mediaPath = Join-Path $PSScriptRoot "..\media"
$outputPath = Join-Path $PSScriptRoot "..\data.json"

function Get-FolderStructure {
    param(
        [string]$path,
        [string]$basePath
    )
    
    $items = Get-ChildItem -Path $path -Force | Where-Object { 
        $_.Name -notlike '.*' -and 
        $_.Name -ne 'README.txt' -and 
        $_.Name -ne 'sample.txt' 
    }
    
    $children = @()
    
    foreach ($item in $items) {
        if ($item.PSIsContainer) {
            $folderObj = @{
                name = $item.Name
                type = 'folder'
                children = Get-FolderStructure -path $item.FullName -basePath $basePath
            }
            $children += $folderObj
        }
        elseif ($item.Extension -eq '.pdf') {
            # Fix: Ensure proper path with forward slashes
            $relativePath = $item.FullName.Replace($basePath, '').Replace('\', '/')
            $relativePath = 'media/' + $relativePath.TrimStart('/')
            
            $fileObj = @{
                name = $item.Name
                type = 'file'
                path = $relativePath
            }
            $children += $fileObj
        }
    }
    
    return $children
}

try {
    $basePath = (Resolve-Path $mediaPath).Path + '\'
    
    $structure = @{
        name = 'media'
        type = 'folder'
        children = Get-FolderStructure -path $mediaPath -basePath $basePath
    }
    
    $json = $structure | ConvertTo-Json -Depth 10
    $json | Out-File -FilePath $outputPath -Encoding UTF8
    
    Write-Host "Successfully generated data.json" -ForegroundColor Green
    exit 0
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
