"""
Notes:
This script is for Windows, as it uses the win32print API.

The printing was tested on a Windows 11 machine connected over USB to a Brother
HL-L6210DW printer. We had to manually download and install the printer driver
to get this to work. The default/generic Microsoft IPP driver that
auto-loaded when this printer was connected over a network did not work with
this script, despite working when manually printing a PDF from Chrome.
"""

import os
import requests
import sys
import time
import yaml

try:
    # Attempt to import necessary modules from pywin32
    import win32print
except ImportError:
    print("Error: This script requires the 'pywin32' library.")
    print("Please install it using: pip install pywin32")
    sys.exit(1)

# Load configuration from config.yaml
config_path = os.path.join(os.path.dirname(__file__), "config.yaml")
try:
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)
    pdf_url = config["pdf_url"]
    download_dir = config["download_dir"]
    printer_name = config["printer_name"]
except FileNotFoundError:
    print(f"Error: Configuration file not found at '{config_path}'")
    print("Please create a config.yaml file with the required settings.")
    sys.exit(1)
except KeyError as e:
    print(f"Error: Missing required configuration key: {e}")
    sys.exit(1)
except yaml.YAMLError as e:
    print(f"Error: Invalid YAML in configuration file: {e}")
    sys.exit(1)

def get_filename(response): 
    cd = response.headers.get("Content-Disposition") or response.headers.get("content-disposition")

    if not cd:
        print("ERROR: no Content-Disposition header found, cannot extract filename")
        return ""

    # we expect the filename to be encoded in the header e.g. filename=myfilename
    try:
        pdf_filename = cd.split("filename=")[1].strip('"')
        print(f"found filename: {pdf_filename}")
    except IndexError:
        print("ERROR: could not extract filename from Content-Disposition header (IndexError)")
        return ""

    return pdf_filename


def get_next_pdf(pdf_url):
    # Send GET request to download the PDF
    try:
        response = requests.get(pdf_url, stream=True, timeout=15)
    except requests.exceptions.Timeout:
        print("GET request timeout")
        return ""
    except requests.exceptions.RequestException as e:
        print(f"GET Request failed: {e}")
        return ""

    if response.status_code != 200:
        # if response is 404, that means there is no pdf in queue, so we can wait and try again later.
        if response.status_code == 404:
            print(f"No pdf in queue, waiting and trying again later. {response.status_code}")
            return ""
        # if response is some other error, we print the error and try again later.
        else:
            # print error
            print(f"Error downloading pdf: {response.status_code}")
            return ""

    # ensure download directory exists
    if not os.path.exists(download_dir):
        os.makedirs(download_dir, exist_ok=True)

    # extract the pdf filename from the response header
    pdf_filename =  get_filename(response)
    if not pdf_filename:
        print("Error: no filename, skipping this print")
        return ""

    # create a filepath based on the name
    target_path = os.path.join(download_dir, pdf_filename)

    # save the pdf to the download directory (streamed)
    with open(target_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)

    return target_path


def mark_pdf_as_printed(pdf_path):
    # extract the pdf filename from the path
    pdf_filename = os.path.basename(pdf_path)

    # send the filename to the pdf_url with a POST request
    try:
        response = requests.post(pdf_url, data={"filename": pdf_filename}, timeout=15)
    except requests.exceptions.Timeout:
        print("POST request timeout")
        return False
    except requests.exceptions.RequestException as e:
        print(f"POST Request failed: {e}")
        return False

    if response.status_code != 200:
        print(f"Error marking pdf as printed: {response.status_code}")
        return False

    return True


def print_pdf_and_wait(filepath, printer_name):
    """
    Sends a PDF file to a specific printer using raw data transfer and blocks
    until the print queue is clear.

    Note: This function works by polling the specified printer's job queue.
    If other print jobs are in the queue (from this or other users),
    this script will wait for ALL jobs to complete, not just the one it sent.

    This is OK for TRS use-case since this script will be the only source of
    print jobs being sent to the printer.

    Note: This method sends the file in "RAW" mode, which relies on the printer
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
                print(f"Warning: {len(jobs)} job(s) already in the queue. This script will add a new job to the queue.")
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
        # This 3-second wait seems excessive, but for our use case
        # (expecting 9 print jobs every four minutes), it should be fine.
        time.sleep(3)

        # Start polling the print queue
        # TODO: add a timeout?
        print("Monitoring print queue... Script will block until queue is clear.")
        while True:
            try:
                jobs = win32print.EnumJobs(hPrinter, 0, -1, 2)
                if len(jobs) == 0:
                    print("Print queue is clear. Assuming job is complete.")
                    break
                print(f"Waiting for {len(jobs)} job(s) to finish...")
                time.sleep(2) # Poll every 2 seconds
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
    while True:
        pdf_path = get_next_pdf(pdf_url)

        if pdf_path:
            print(f"Downloaded pdf: {pdf_path}")

            # blocks until the print is complete
            print_pdf_and_wait(pdf_path, printer_name)
            print(f"Printed pdf: {pdf_path}")

            # update the database to mark the pdf as printed
            mark_pdf_as_printed(pdf_path)
        else:
            print("No pdf in queue, waiting and trying again later.")
            time.sleep(3)
