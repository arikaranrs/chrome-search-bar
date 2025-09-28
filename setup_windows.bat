@echo off
echo ========================================
echo Voice Assistant - Windows Setup Script
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as administrator - Good!
) else (
    echo ERROR: This script must be run as administrator
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo Step 1: Installing Chocolatey (Windows Package Manager)
echo --------------------------------------------------------
powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"

echo.
echo Step 2: Installing Node.js and npm
echo -----------------------------------
choco install nodejs -y

echo.
echo Step 3: Installing Python 3.11 (more stable than 3.13)
echo -------------------------------------------------------
choco install python311 -y

echo.
echo Step 4: Installing Git
echo ----------------------
choco install git -y

echo.
echo Step 5: Refreshing environment variables
echo ----------------------------------------
refreshenv

echo.
echo Step 6: Upgrading pip and installing setuptools
echo -----------------------------------------------
python -m pip install --upgrade pip setuptools wheel

echo.
echo Step 7: Installing Python dependencies
echo --------------------------------------
python -m pip install -r requirements.txt

echo.
echo Step 8: Installing Node.js dependencies
echo ---------------------------------------
npm install

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo You can now run the voice assistant with:
echo   npm run dev
echo.
pause
