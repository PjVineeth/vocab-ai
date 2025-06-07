import subprocess
import sys
import os

def start_flask_server():
    # Get the directory of the current script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Activate virtual environment and start Flask server
    if sys.platform == "win32":
        activate_script = os.path.join(current_dir, ".venv", "Scripts", "activate")
        command = f"cmd /c {activate_script} && python new_app.py"
    else:
        activate_script = os.path.join(current_dir, ".venv", "bin", "activate")
        command = f"source {activate_script} && python new_app.py"
    
    try:
        subprocess.Popen(command, shell=True)
        print("Flask server started successfully!")
    except Exception as e:
        print(f"Error starting Flask server: {e}")

if __name__ == "__main__":
    start_flask_server() 