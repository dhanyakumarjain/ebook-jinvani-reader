@echo off

REM ========================================
REM  JINVANI EBOOK READER - RESET LIBRARY
REM ========================================

echo.
echo ========================================
echo   Jinvani eBook Reader
echo   Reset Library
echo ========================================
echo.
echo [WARNING] This will:
echo   1. Delete ALL PDF files from media folder
echo   2. Reset data.json to empty structure
echo   3. Keep folder structure intact
echo.
echo This action CANNOT be undone!
echo.

set /p confirm="Are you sure you want to continue? (yes/no): "

if /i not "%confirm%"=="yes" (
    echo.
    echo [CANCELLED] Reset operation cancelled
    echo.
    pause
    exit /b 0
)

echo.
echo ========================================
echo   Resetting Library...
echo ========================================
echo.

REM Navigate to project root
cd ..

REM Count PDFs before deletion
set pdfCount=0
for /r "media" %%f in (*.pdf) do (
    set /a pdfCount+=1
)

echo [1/3] Found %pdfCount% PDF file(s) to delete
echo.

REM Delete all PDFs from media folder
echo [2/3] Deleting PDF files...
for /r "media" %%f in (*.pdf) do (
    del "%%f"
    echo Deleted: %%~nxf
)
echo.

REM Create empty data.json
echo [3/3] Resetting data.json...
(
echo {
echo   "name": "media",
echo   "type": "folder",
echo   "children": []
echo }
) > data.json

echo.
echo ========================================
echo   RESET COMPLETE!
echo ========================================
echo.
echo - Deleted %pdfCount% PDF file(s)
echo - data.json reset to empty structure
echo - Folder structure preserved
echo.
echo To add new PDFs:
echo 1. Copy PDFs to media folder
echo 2. Run 'generate-data.bat'
echo.

pause
