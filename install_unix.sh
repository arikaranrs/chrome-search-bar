#!/bin/bash

echo "Installing KIRA Voice Assistant on Unix/Linux/macOS..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from your package manager or https://python.org"
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create virtual environment"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo
    echo "Some packages failed to install. Trying alternative installation..."
    pip install flask flask-cors google-generativeai opencv-python numpy pillow speechrecognition pyttsx3 livekit livekit-api python-dotenv websockets textblob
fi

echo
echo "Installation complete!"
echo
echo "To run the voice assistant:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Run the backend: python scripts/flask_backend.py"
echo "3. Open the frontend in your browser"
echo
