@echo off
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
echo 2. This script will update config.js automatically
echo.
echo Opening media folder...
start "" "%cd%\media"

echo.
echo After copying PDFs, press any key to update config.js...
pause > nul

REM Generate config.js with PDF list
echo Scanning media folder for PDFs...
echo // Configuration for Jinvani eBook Reader > config.js
echo const CONFIG = { >> config.js
echo     // Media folder path (relative to index.html) >> config.js
echo     mediaFolder: 'media/', >> config.js
echo. >> config.js
echo     // List of PDF files in the media folder >> config.js
echo     pdfFiles: [ >> config.js

REM List all PDF files
setlocal enabledelayedexpansion
set count=0
for %%f in (media\*.pdf) do (
    set /a count+=1
    echo         '%%~nxf', >> config.js
)

echo     ], >> config.js
echo. >> config.js
echo     // Application settings >> config.js
echo     settings: { >> config.js
echo         defaultZoom: 1.5, >> config.js
echo         enableKeyboardShortcuts: true, >> config.js
echo         showWelcomeScreen: true, >> config.js
echo     } >> config.js
echo }; >> config.js

echo.
echo ========================================
echo   Found %count% PDF file(s)
echo ========================================
echo.
echo config.js has been updated!
echo.
echo Next steps:
echo 1. Run 'push.bat' to upload to GitHub
echo 2. Or open index.html to test locally
echo.
pause
