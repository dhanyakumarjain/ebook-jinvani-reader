@echo off
echo ========================================
echo   Jinvani eBook Reader - Git Push
echo ========================================
echo.

REM Add all changes
echo [1/3] Adding all changes...
git add .

REM Commit with message
echo.
echo [2/3] Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update ebook reader

git commit -m "%commit_msg%"

REM Push to GitHub
echo.
echo [3/3] Pushing to GitHub...
git push

echo.
echo ========================================
echo   Push completed successfully!
echo ========================================
echo.
echo Your changes are now live at:
echo https://dhanyakumarjain.github.io/ebook-jinvani-reader/
echo.
pause
