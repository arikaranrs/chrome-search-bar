# Windows Installation Guide for KIRA Voice Assistant

## Quick Installation

1. **Download and run the Windows installer:**
   \`\`\`cmd
   install_windows.bat
   \`\`\`

## Manual Installation (if automatic fails)

### Prerequisites
- Python 3.8 or higher
- Windows 10/11
- Internet connection

### Step-by-Step Installation

1. **Install Python** (if not already installed):
   - Download from [python.org](https://python.org)
   - Make sure to check "Add Python to PATH" during installation

2. **Open Command Prompt as Administrator:**
   - Press `Win + X` and select "Command Prompt (Admin)" or "PowerShell (Admin)"

3. **Navigate to the project directory:**
   \`\`\`cmd
   cd path\to\voice-assistant
   \`\`\`

4. **Create virtual environment:**
   \`\`\`cmd
   python -m venv venv
   \`\`\`

5. **Activate virtual environment:**
   \`\`\`cmd
   venv\Scripts\activate.bat
   \`\`\`

6. **Upgrade pip:**
   \`\`\`cmd
   python -m pip install --upgrade pip
   \`\`\`

7. **Install dependencies:**
   \`\`\`cmd
   pip install -r requirements.txt
   \`\`\`

### Troubleshooting

#### If you get "Microsoft Visual C++ 14.0 is required" error:
This error has been fixed by removing dependencies that require compilation. The new requirements.txt uses only pre-compiled packages.

#### If installation still fails:
1. Try installing packages individually:
   \`\`\`cmd
   pip install flask flask-cors google-generativeai
   pip install opencv-python numpy pillow
   pip install speechrecognition pyttsx3
   pip install livekit livekit-api python-dotenv websockets textblob
   \`\`\`

2. Use pre-compiled wheels only:
   \`\`\`cmd
   pip install --only-binary=all -r requirements.txt
   \`\`\`

### Running the Application

1. **Activate virtual environment** (if not already active):
   \`\`\`cmd
   venv\Scripts\activate.bat
   \`\`\`

2. **Start the backend server:**
   \`\`\`cmd
   python scripts/flask_backend.py
   \`\`\`

3. **Open your browser** and navigate to the frontend URL

### Common Issues

- **Python not found**: Make sure Python is installed and added to PATH
- **Permission errors**: Run Command Prompt as Administrator
- **Network issues**: Check your internet connection and firewall settings
- **Port conflicts**: Make sure port 5000 is not being used by another application

### System Requirements

- **OS**: Windows 10/11
- **Python**: 3.8+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Internet connection for AI services
