@echo off

REM ========================================
REM  JINVANI EBOOK READER - GIT PUSH
REM ========================================

echo.
echo ========================================
echo   Jinvani eBook Reader
echo   Git Push Utility
echo ========================================
echo.

REM Navigate to project root
cd ..

REM Check if git is installed
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed or not in PATH
    echo.
    echo Please install Git from:
    echo https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)

echo [INFO] Git detected
echo.

REM Check if this is a git repository
if not exist ".git" (
    echo [ERROR] This is not a Git repository
    echo.
    echo Initialize Git first with:
    echo   git init
    echo   git remote add origin YOUR_REPO_URL
    echo.
    pause
    exit /b 1
)

REM Show current status
echo [1/4] Checking repository status...
echo.
git status
echo.

REM Add all files
echo [2/4] Adding all files...
git add .
echo.

REM Get commit message from user
set /p commit_msg="[3/4] Enter commit message (or press Enter for default): "

REM Use default message if empty
if "%commit_msg%"=="" (
    set commit_msg=Update PDF library
)

echo.
echo Commit message: %commit_msg%
echo.

REM Commit changes
echo Committing changes...
git commit -m "%commit_msg%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARNING] Nothing to commit or commit failed
    echo.
)

REM Push to remote
echo.
echo [4/4] Pushing to remote repository...
echo.
git push

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Changes have been pushed to GitHub
    echo.
    echo Your site will be updated in 2-3 minutes at:
    echo https://dhanyakumarjain.github.io/ebook-jinvani-reader/
    echo.
) else (
    echo.
    echo [ERROR] Push failed
    echo.
    echo Common issues:
    echo 1. No remote repository configured
    echo 2. Authentication required
    echo 3. No internet connection
    echo.
    echo Try:
    echo   git remote -v  (to check remote)
    echo   git push -u origin main  (to set upstream)
    echo.
)

echo.
pause
