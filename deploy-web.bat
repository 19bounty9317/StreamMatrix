@echo off
echo ========================================
echo StreamMatrix Web - Deployment Script
echo ========================================
echo.

echo [1/4] Building Web-Version...
call npm run build:web
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [2/4] Creating deployment directory...
if not exist "docs\app" mkdir "docs\app"
echo.

echo [3/4] Copying files to docs/app...
xcopy /E /I /Y dist\web\* docs\app\
if errorlevel 1 (
    echo ERROR: Copy failed!
    pause
    exit /b 1
)
echo.

echo [4/4] Deployment ready!
echo.
echo ========================================
echo Next steps:
echo 1. git add docs/app
echo 2. git commit -m "Deploy web version"
echo 3. git push
echo.
echo Web-App wird verfügbar sein unter:
echo https://19bounty9317.github.io/StreamMatrix/app
echo ========================================
echo.

pause
