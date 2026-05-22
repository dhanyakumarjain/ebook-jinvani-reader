@echo off
setlocal enabledelayedexpansion
echo ========================================
echo   Add PDF to Jinvani eBook Reader
echo ========================================
echo.

REM Check if media folder exists
if not exist "media" (
    echo Creating media folder...
    mkdir media
)

echo Instructions:
echo 1. Copy your PDF files to the 'media' folder
echo 2. You can create subfolders for organization
echo 3. This script will scan and update config.js automatically
echo.
echo Opening media folder...
start "" "%cd%\media"

echo.
echo After organizing your PDFs, press any key to update config.js...
pause > nul

REM Generate config.js with folder structure
echo Scanning media folder for PDFs and folders...
echo // Configuration for Jinvani eBook Reader > config.js
echo const CONFIG = { >> config.js
echo     // Media folder path (relative to index.html^) >> config.js
echo     mediaFolder: 'media/', >> config.js
echo. >> config.js
echo     // Folder structure with PDFs >> config.js
echo     structure: { >> config.js

REM Count total PDFs
set totalCount=0

REM Process root level files
set rootFiles=
for %%f in (media\*.pdf) do (
    set /a totalCount+=1
    if defined rootFiles (
        set "rootFiles=!rootFiles!, '%%~nxf'"
    ) else (
        set "rootFiles='%%~nxf'"
    )
)

REM If there are root files, add them
if defined rootFiles (
    echo         '_files': [!rootFiles!], >> config.js
)

REM Process folders
for /d %%d in (media\*) do (
    set folderName=%%~nxd
    set folderFiles=
    set folderCount=0
    
    REM Get files in this folder
    for %%f in ("%%d\*.pdf") do (
        set /a totalCount+=1
        set /a folderCount+=1
        if defined folderFiles (
            set "folderFiles=!folderFiles!, '%%~nxf'"
        ) else (
            set "folderFiles='%%~nxf'"
        )
    )
    
    REM If folder has files, add it to config
    if !folderCount! GTR 0 (
        echo         '!folderName!': [!folderFiles!], >> config.js
    )
)

echo     }, >> config.js
echo. >> config.js
echo     // Application settings >> config.js
echo     settings: { >> config.js
echo         defaultZoom: 1.5, >> config.js
echo         enableKeyboardShortcuts: true, >> config.js
echo         showWelcomeScreen: true, >> config.js
echo         autoExpandFolders: false, >> config.js
echo     } >> config.js
echo }; >> config.js

echo.
echo ========================================
echo   Found %totalCount% PDF file(s)
echo ========================================
echo.
echo config.js has been updated with folder structure!
echo.
echo Folder structure:
echo - Root files: Direct PDFs in media folder
echo - Subfolders: Organized by folder names
echo.
echo Next steps:
echo 1. Run 'push.bat' to upload to GitHub
echo 2. Or run 'open-local.bat' to test locally
echo.
pause
