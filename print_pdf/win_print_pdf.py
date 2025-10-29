import sys
import os
import time

try:
    # Attempt to import necessary modules from pywin32
    import win32api
    import win32print
except ImportError:
    print("Error: This script requires the 'pywin32' library.")
    print("Please install it using: pip install pywin32")
    sys.exit(1)

def print_pdf_and_wait(filepath):
    """
    Sends a PDF file to the default printer and blocks until the print queue is clear.

    Note: This function works by polling the default printer's job queue.
    If other print jobs are in the queue (from this or other users),
    this script will wait for ALL jobs to complete, not just the one it sent.
    """

    # Ensure the file path is absolute, as ShellExecute can be sensitive
    abs_filepath = os.path.abspath(filepath)

    if not os.path.exists(abs_filepath):
        print(f"Error: File not found at '{abs_filepath}'")
        return

    print(f"Attempting to print file: {abs_filepath}")

    printer_name = None
    try:
        # Get the default printer name
        printer_name = win32print.GetDefaultPrinter()
    except Exception as e:
        # This can fail if no default printer is set (e.g., in a server environment)
        print(f"Error: Could not get default printer. Is one set up in Windows? {e}")
        return

    print(f"Using default printer: {printer_name}")

    hPrinter = None
    try:
        # Open a handle to the printer
        # PRINTER_ACCESS_USE is required to EnumJobs
        hPrinter = win32print.OpenPrinter(printer_name, {"DesiredAccess": win32print.PRINTER_ACCESS_USE})

        # Check queue status *before* adding our job
        try:
            jobs = win32print.EnumJobs(hPrinter, 0, -1, 2)
            if jobs:
                print(f"Warning: {len(jobs)} job(s) already in the queue. Will wait for all jobs to clear.")
        except Exception as e:
            # EnumJobs can fail for permissions reasons
            print(f"Warning: Could not read job queue. Monitoring may be unreliable. {e}")

        # Send the print job
        # This uses the Windows "print" verb, which invokes the default
        # PDF handler (e.g., Acrobat, Edge) to print the file.
        print("Sending print job to spooler...")
        try:
            # ShellExecute returns a value > 32 on success
            ret = win32api.ShellExecute(
                0,        # Handle to parent window (0=desktop)
                "print",  # Verb
                abs_filepath, # File to print
                None,     # Parameters (None for print)
                ".",      # Directory
                0         # Show command (0=hide)
            )

            if ret <= 32:
                print(f"Error: ShellExecute failed with code {ret}. Could not start print job.")
                print("Make sure a default program is set for printing PDFs.")
                return

        except Exception as e:
            print(f"Error: Failed to execute 'print' command. {e}")
            print("Is a default PDF viewer associated with the 'print' action?")
            return

        # Give the spooler a moment to register the new job
        print("Waiting for job to appear in queue...")
        time.sleep(3)

        # Start polling the print queue
        print("Monitoring print queue... Script will block until queue is clear.")
        while True:
            try:
                jobs = win32print.EnumJobs(hPrinter, 0, -1, 2)
                if len(jobs) == 0:
                    print("Print queue is clear. Assuming job is complete.")
                    break
                print(f"Waiting for {len(jobs)} job(s) to finish...")
                time.sleep(3) # Poll every 3 seconds
            except Exception as e:
                print(f"Error while polling queue (job may still be printing): {e}")
                print("Stopping monitoring loop.")
                # We can't poll, so we have to break
                break

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Always close the printer handle
        if hPrinter:
            win32print.ClosePrinter(hPrinter)
            print("Closed printer handle.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python print_pdf_windows.py \"C:\\path\\to\\your\\file.pdf\"")
        sys.exit(1)

    pdf_path = sys.argv[1]
    print_pdf_and_wait(pdf_path)
