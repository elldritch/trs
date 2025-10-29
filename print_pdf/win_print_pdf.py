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

def print_pdf_and_wait(filepath, printer_name):
    """
    Sends a PDF file to a specific printer using raw data transfer and blocks
    until the print queue is clear.

    Note: This function works by polling the specified printer's job queue.
    If other print jobs are in the queue (from this or other users),
    this script will wait for ALL jobs to complete, not just the one it sent.

    This method sends the file in "RAW" mode, which relies on the printer
    being able to interpret the file type directly (e.g., a PostScript printer
    for a PS file, or a modern printer that can handle PDF).
    """

    abs_filepath = os.path.abspath(filepath)

    if not os.path.exists(abs_filepath):
        print(f"Error: File not found at '{abs_filepath}'")
        return

    print(f"Attempting to print file: {abs_filepath}")

    print(f"Using printer: {printer_name}")

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

        print("Sending print job to spooler...")
        try:
            # Open the PDF file in binary read mode
            with open(abs_filepath, 'rb') as f:
                pdf_data = f.read()
        except Exception as e:
            print(f"Error: Failed to open pdf in binary read mode. {e}")
            return

        try:
            # Start a print job. The job title is the filename.
            # The "RAW" datatype indicates the data is sent without modification.
            job_id = win32print.StartDocPrinter(hPrinter, 1, (os.path.basename(abs_filepath), None, "RAW"))
            if job_id == 0:
                print("Error: StartDocPrinter failed. Could not start print job.")
                return

            # Start the page
            win32print.StartPagePrinter(hPrinter)
            # Write the file content to the printer
            win32print.WritePrinter(hPrinter, pdf_data)
            # End the page
            win32print.EndPagePrinter(hPrinter)

            # End the print job
            win32print.EndDocPrinter(hPrinter)
            print("Print job sent successfully.")
        except Exception as e:
            print(f"Error: Failed to send job to printer. {e}")
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
    if len(sys.argv) < 3:
        print("Usage: python win_print_pdf.py \"C:\\path\\to\\your\\file.pdf\" \"Printer Name\"")
        print("Example: python win_print_pdf.py \"report.pdf\" \"HP LaserJet Pro M404n\"")
        sys.exit(1)

    pdf_path = sys.argv[1]
    printer_arg = sys.argv[2]
    print_pdf_and_wait(pdf_path, printer_arg)
