import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
import pandas as pd
import time

# Check if URL is passed as an argument
if len(sys.argv) != 2:
    print("Usage: python download_schools.py <url>")
    sys.exit(1)

# Get the URL from the command line argument
url = sys.argv[1]

# Define the output path
output_path = "/tmp/top_secondary_schools_full.csv"

# Initialize WebDriver
driver = webdriver.Chrome()
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
