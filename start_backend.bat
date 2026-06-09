@echo off
echo [LECTRA-AI] Starting Backend Server...
echo.

REM Refresh environment variables in this session
call refreshenv 2>nul

REM Try using py launcher first (works immediately after Python install)
where py >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Using Python launcher
    cd backend
    py -m pip install --upgrade pip
    py -m pip install -r requirements.txt
    py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    goto :end
)

REM Fallback: Try common Python installation paths
set PYTHON_PATHS="%LOCALAPPDATA%\Programs\Python\Python311\python.exe" "%LOCALAPPDATA%\Programs\Python\Python310\python.exe" "%ProgramFiles%\Python311\python.exe" "C:\Python311\python.exe"

for %%P in (%PYTHON_PATHS%) do (
    if exist %%P (
        echo [INFO] Found Python at %%P
        cd backend
        %%P -m pip install --upgrade pip
        %%P -m pip install -r requirements.txt
        %%P -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
        goto :end
    )
)

echo [ERROR] Python not found!
echo.
echo Please either:
echo 1. Restart your computer to refresh PATH
echo 2. Or manually run: winget install Python.Python.3.11
echo.
pause

:end
