@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo PNR XML Anonymiser
echo ========================================
echo.

echo Input folder: input-pnrs
echo Output folder: anonymized
echo.

if not exist "input-pnrs" mkdir "input-pnrs"
if not exist "anonymized" mkdir "anonymized"

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not in PATH.
  echo Install Node.js, then run this again.
  echo.
  pause
  exit /b 1
)

if not exist "anonymise-pnr.js" (
  echo ERROR: Could not find anonymise-pnr.js in this folder.
  echo Make sure this BAT file is in the same folder as anonymise-pnr.js.
  echo.
  pause
  exit /b 1
)

echo Drop your PNR XML files into the input-pnrs folder.
echo Then double-click this BAT file to process them.
echo.

echo Running anonymiser...
node "anonymise-pnr.js"
set ERR=%ERRORLEVEL%

echo.
if %ERR% neq 0 (
  echo Anonymiser finished with errors. Exit code: %ERR%
) else (
  echo Done. Check the anonymized folder.
)

echo.
pause
exit /b %ERR%
