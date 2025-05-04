import sys
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import pandas as pd
import time

# Default browser paths for macOS
DEFAULT_BROWSER_PATHS = {
    "brave": "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "chrome": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "edge": "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
}

# Check command-line arguments
if len(sys.argv) < 2:
    print("Usage: python download_schools.py <url> [--browser <browser_name>] [--browser-path <path>]")
    sys.exit(1)

url = sys.argv[1]
browser_name = "brave"  # Default browser
browser_path = DEFAULT_BROWSER_PATHS.get(browser_name)

# Parse additional arguments
for i in range(2, len(sys.argv), 2):
    if sys.argv[i] == "--browser":
        browser_name = sys.argv[i + 1].lower()
        browser_path = DEFAULT_BROWSER_PATHS.get(browser_name, None)
    elif sys.argv[i] == "--browser-path":
        browser_path = sys.argv[i + 1]

# Validate browser path
if not browser_path or not os.path.exists(browser_path):
    print(f"Error: Browser path '{browser_path}' for '{browser_name}' not found.")
    print("Please provide a valid --browser-path or ensure the browser is installed.")
    sys.exit(1)

# Define the output path
output_path = "/tmp/top_secondary_schools_full.csv"

# Set up Chrome options to use the specified browser
chrome_options = Options()
chrome_options.binary_location = browser_path

# Initialize WebDriver with ChromeDriver and browser options
driver = webdriver.Chrome(options=chrome_options)

# Open the URL
driver.get(url)

# Wait for the page to load
time.sleep(5)

# Function to extract table data
def extract_table_data():
    table = driver.find_element(By.CLASS_NAME, "table.table-striped")
    headers = [header.text for header in table.find_elements(By.TAG_NAME, "th")]
    rows = []
    for row in table.find_elements(By.TAG_NAME, "tr")[1:]:  # Skip header row
        cells = row.find_elements(By.TAG_NAME, "td")
        rows.append([cell.text for cell in cells])
    return headers, rows

all_rows = []
page = 1

while True:
    headers, rows = extract_table_data()
    all_rows.extend(rows)
    
    # Try to find the 'Next' button and click it
    try:
        next_button = driver.find_element(By.LINK_TEXT, str(page + 1))
        next_button.click()
        page += 1
        time.sleep(5)  # Adjust sleep time if necessary
    except:
        break

# Create a DataFrame
if headers and all_rows:
    df = pd.DataFrame(all_rows, columns=headers)
    df.to_csv(output_path, index=False)
    print(f"Data has been saved to {output_path}")
else:
    print("No data to save")

# Close the WebDriver
driver.quit()