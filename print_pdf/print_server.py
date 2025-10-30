import os
import requests
import subprocess
import time

pdf_url = "example.com"
download_dir = "C:\\Users\\YourUsername\\Downloads"

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

    # extract the pdf filename from the response header
    pdf_filename = response.headers.get("Content-Disposition").split("filename=")[1]

    # save the pdf to the download directory
    with open(os.path.join(download_dir, pdf_filename), "wb") as f:
        f.write(response.content)
    return os.path.join(download_dir, pdf_filename)

def mark_pdf_as_printed(pdf_path):
    # extract the pdf filename from the path
    pdf_filename = os.path.basename(pdf_path)
    # send the filename to the pdf_url with a POST request
    response = requests.post(pdf_url, data={"filename": pdf_filename})
    if response.status_code != 200:
        print(f"Error marking pdf as printed: {response.status_code}")
        return False
    return True

# main function
if __name__ == "__main__":
    while True:
        pdf_path = get_next_pdf(pdf_url)
        if pdf_path:
            print(f"Downloaded pdf: {pdf_path}")
            # print the pdf using win_print_pdf.py
            subprocess.run(["python", "win_print_pdf.py", pdf_path, "Brother HL-L6210DW series"])
            print(f"Printed pdf: {pdf_path}")
            # update the database to mark the pdf as printed
            mark_pdf_as_printed(pdf_path)
        else:
            print("No pdf in queue, waiting and trying again later.")
            time.sleep(3)

        





