# Windows PDF Printer Script
MILDLY OUT OF DATE, DON'T LOOK TOO CLOSELY...
This Python script sends a local PDF file on a Windows machine to a specific printer. It then monitors that printer's queue and blocks (waits) until the queue is clear before exiting.

## Requirements
- Windows operating system
- Python 3.x
- The target printer must be installed and accessible from the computer.
- Find your printer's exact name (e.g., in "Printers & scanners" settings).

## Setup
### 1. Create a Python Virtual Environment

It's recommended to run this script in a virtual environment.
```shell
# 1. Navigate to your project folder
cd C:\path\to\your\project

# 2. Create a virtual environment named 'venv'
python -m venv venv

# 3. Activate the virtual environment
.\venv\Scripts\activate
```

### 2. Install Dependencies
This script requires the pywin32 library to interact with Windows APIs.# While your venv is active
```shell
pip install pywin32
```

## How to Run
You can run the script from your command line, passing the path to the PDF and the printer name as arguments.
**Important**: If the file path or printer name contains spaces, be sure to wrap them in quotes.
```shell
# Ensure your virtual environment is active
# .\venv\Scripts\activate

python win_print_pdf.py "C:\path\to\your file.pdf" "Your Printer Name"
```
The script will print status messages to the console and will exit once the print queue for the specified printer is empty.
