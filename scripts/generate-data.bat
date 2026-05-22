@echo off
setlocal enabledelayedexpansion

REM ========================================
REM  JINVANI EBOOK READER - DATA GENERATOR
REM ========================================

echo.
echo ========================================
echo   Jinvani eBook Reader
echo   Data Generator
echo ========================================
echo.

REM Check if media folder exists
if not exist "..\media" (
    echo [ERROR] media folder not found!
    echo Creating media folder...
    mkdir "..\media"
    echo.
)

echo [1/3] Scanning media folder...
echo.

REM Generate data.json using PowerShell
powershell -ExecutionPolicy Bypass -Command ^
"$mediaPath = '..\media'; " ^
"function Get-FolderStructure($path, $basePath) { " ^
"    $items = Get-ChildItem -Path $path -Force | Where-Object { $_.Name -notlike '.*' -and $_.Name -ne 'README.txt' -and $_.Name -ne 'sample.txt' }; " ^
"    $children = @(); " ^
"    foreach ($item in $items) { " ^
"        if ($item.PSIsContainer) { " ^
"            $folderObj = @{ " ^
"                name = $item.Name; " ^
"                type = 'folder'; " ^
"                children = Get-FolderStructure $item.FullName $basePath " ^
"            }; " ^
"            $children += $folderObj; " ^
"        } elseif ($item.Extension -eq '.pdf') { " ^
"            $relativePath = $item.FullName.Replace($basePath, 'media').Replace('\', '/'); " ^
"            $fileObj = @{ " ^
"                name = $item.Name; " ^
"                type = 'file'; " ^
"                path = $relativePath " ^
"            }; " ^
"            $children += $fileObj; " ^
"        } " ^
"    } " ^
"    return $children; " ^
"} " ^
"$basePath = (Resolve-Path $mediaPath).Path + '\'; " ^
"$structure = @{ " ^
"    name = 'media'; " ^
"    type = 'folder'; " ^
"    children = Get-FolderStructure $mediaPath $basePath " ^
"}; " ^
"$json = $structure | ConvertTo-Json -Depth 10; " ^
"$json | Out-File -FilePath '..\data.json' -Encoding UTF8;"

if %ERRORLEVEL% EQU 0 (
    echo [2/3] data.json generated successfully!
    echo.
    
    REM Count PDFs
    set pdfCount=0
    for /r "..\media" %%f in (*.pdf) do (
        set /a pdfCount+=1
    )
    
    echo [3/3] Found !pdfCount! PDF file(s)
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo data.json has been created/updated
    echo Location: %cd%\..\data.json
    echo.
    echo Next steps:
    echo 1. Run 'run-local-server.bat' to test locally
    echo 2. Run 'git-push.bat' to publish online
    echo.
) else (
    echo [ERROR] Failed to generate data.json
    echo Please check if PowerShell is available
    echo.
)

pause
