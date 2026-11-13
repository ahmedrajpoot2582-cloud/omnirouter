@echo off
echo ==============================================
echo Pushing OmniRouter to GitHub (ahmedrajpoot2582-cloud)
echo ==============================================
cd /d "%~dp0"
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Pushed to GitHub! Vercel is now deploying automatically.
) else (
    echo [FAILED] Git push encountered an error. Please check your GitHub credentials.
)
pause
