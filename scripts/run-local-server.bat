@echo off

REM ========================================
REM  JINVANI EBOOK READER - LOCAL SERVER
REM ========================================

echo.
echo ========================================
echo   Jinvani eBook Reader
echo   Local Development Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo.
    echo Please install Python from:
    echo https://www.python.org/downloads/
    echo.
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo [INFO] Python detected
echo.

REM Navigate to project root
cd ..

echo [INFO] Starting local server on port 8000...
echo.
echo ========================================
echo   Server is running!
echo ========================================
echo.
echo Open your browser and visit:
echo.
echo   http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Open browser automatically
start http://localhost:8000

REM Start Python HTTP server
python -m http.server 8000
