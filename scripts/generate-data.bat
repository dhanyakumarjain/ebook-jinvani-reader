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
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0generate-data.ps1"

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
