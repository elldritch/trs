import os
import re
import requests
import subprocess
import time
from urllib.parse import urlparse, unquote

pdf_url = "example.com"
download_dir = "C:\\Users\\YourUsername\\Downloads"
printer_name = "Brother HL-L6210DW series"

# The function below will attempt to extract a filename from the "Content-Disposition" HTTP header, if present.
# If the "Content-Disposition" header or a valid filename are not present, it tries to determine a filename from the URL path
# by extracting the last component after the final '/'. If the URL path does not provide a valid filename (e.g., it ends with a slash),
# the function will generate a default filename using the pattern "download_<timestamp>.pdf", where <timestamp> is the current UNIX time in seconds.
def derive_filename(response, request_url, default_ext=".pdf"):
    cd = response.headers.get("Content-Disposition") or response.headers.get("content-disposition")
    filename = None

    if cd:
        # Try RFC 5987: filename*=UTF-8''encoded-name.pdf
        m = re.search(r'filename\*\s*=\s*([^;]+)', cd, flags=re.IGNORECASE)
        if m:
            v = m.group(1).strip().strip('"').strip()
            if "''" in v:
                charset, rest = v.split("''", 1)
                try:
                    filename = unquote(rest, encoding=charset, errors="strict")
                except LookupError:
                    filename = unquote(rest)
            else:
                filename = unquote(v.strip("'"))
        # Fallback: filename="name.pdf" or filename=name.pdf
        if not filename:
            m = re.search(r'filename\s*=\s*(?:"([^"]+)"|([^;]+))', cd, flags=re.IGNORECASE)
            if m:
                filename = (m.group(1) or m.group(2)).strip()

    if not filename:
        # Fallback to URL path
        url_for_name = response.url or request_url
        path_name = os.path.basename(urlparse(url_for_name).path)
        filename = path_name if path_name else f"download_{int(time.time())}{default_ext}"

    # Sanitize: remove path components and NULs
    filename = os.path.basename(filename).replace("\x00", "")
    # Ensure extension if missing and content-type implies PDF
    if not os.path.splitext(filename)[1]:
        ct = (response.headers.get("Content-Type") or "").lower()
        if "pdf" in ct and default_ext:
            filename += default_ext
    return filename


def get_next_pdf(pdf_url):
    # Send GET request to download the PDF
    response = requests.get(pdf_url, stream=True)
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
    pdf_filename = derive_filename(response, pdf_url, default_ext=".pdf")
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
    response = requests.post(pdf_url, data={"filename": pdf_filename})
    if response.status_code != 200:
        print(f"Error marking pdf as printed: {response.status_code}")
        return False
    return True


if __name__ == "__main__":
    while True:
        pdf_path = get_next_pdf(pdf_url)
        if pdf_path:
            print(f"Downloaded pdf: {pdf_path}")
            # print the pdf using win_print_pdf.py. This will block until
            # win_print_pdf.py exits, which occurs after the PDF has finished
            # printing.
            # Potential TODO: add a timeout to win_print_pdf.py 
            subprocess.run(["python", "win_print_pdf.py", pdf_path, printer_name])
            print(f"Printed pdf: {pdf_path}")
            # update the database to mark the pdf as printed
            mark_pdf_as_printed(pdf_path)
        else:
            print("No pdf in queue, waiting and trying again later.")
            time.sleep(3)
