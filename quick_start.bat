@echo off
echo ========================================
echo KIRA Voice Assistant - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please run setup_windows.bat first
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Python is not installed
    echo Please run setup_windows.bat first
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    npm install
)

REM Check if Python dependencies are installed
python -c "import flask" >nul 2>&1
if %errorLevel% neq 0 (
    echo Installing Python dependencies...
    python -m pip install -r requirements.txt
)

echo.
echo Starting KIRA Voice Assistant...
echo ================================
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the application
echo.

REM Start the development server
npm run dev
