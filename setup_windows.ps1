# Voice Assistant - Windows PowerShell Setup Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "Voice Assistant - Windows Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "ERROR: This script must be run as administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

Write-Host "Step 1: Installing Chocolatey (Windows Package Manager)" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
try {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    Write-Host "✓ Chocolatey installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install Chocolatey: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 2: Installing Node.js and npm" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
try {
    choco install nodejs -y
    Write-Host "✓ Node.js installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install Node.js: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 3: Installing Python 3.11" -ForegroundColor Cyan
Write-Host "-------------------------------" -ForegroundColor Cyan
try {
    choco install python311 -y
    Write-Host "✓ Python 3.11 installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install Python: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 4: Installing Git" -ForegroundColor Cyan
Write-Host "----------------------" -ForegroundColor Cyan
try {
    choco install git -y
    Write-Host "✓ Git installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install Git: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 5: Refreshing environment variables" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host ""
Write-Host "Step 6: Upgrading pip and installing setuptools" -ForegroundColor Cyan
Write-Host "-----------------------------------------------" -ForegroundColor Cyan
try {
    python -m pip install --upgrade pip setuptools wheel
    Write-Host "✓ pip and setuptools upgraded successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to upgrade pip: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 7: Installing Python dependencies" -ForegroundColor Cyan
Write-Host "--------------------------------------" -ForegroundColor Cyan
try {
    python -m pip install -r requirements.txt
    Write-Host "✓ Python dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install Python dependencies: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 8: Installing Node.js dependencies" -ForegroundColor Cyan
Write-Host "---------------------------------------" -ForegroundColor Cyan
try {
    npm install
    Write-Host "✓ Node.js dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install Node.js dependencies: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run the voice assistant with:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
