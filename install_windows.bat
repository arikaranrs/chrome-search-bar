@echo off
echo Installing KIRA Voice Assistant on Windows...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies with Windows-specific options
echo Installing dependencies...
pip install --only-binary=all -r requirements.txt
if errorlevel 1 (
    echo.
    echo Some packages failed to install. Trying alternative installation...
    pip install flask flask-cors google-generativeai opencv-python numpy pillow speechrecognition pyttsx3 livekit livekit-api python-dotenv websockets textblob
)

echo.
echo Installation complete!
echo.
echo To run the voice assistant:
echo 1. Activate the virtual environment: venv\Scripts\activate.bat
echo 2. Run the backend: python scripts/flask_backend.py
echo 3. Open the frontend in your browser
echo.
pause
