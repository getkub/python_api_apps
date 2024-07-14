from selenium import webdriver
from selenium.webdriver.common.by import By
import pandas as pd
import time

# Initialize WebDriver
driver = webdriver.Chrome()

url = "URL HERE"
driver.get(url)

# Wait for the page to load
time.sleep(10)  # You can adjust the sleep time as needed

# Find the table
try:
    table = driver.find_element(By.CLASS_NAME, "table.table-striped")
    print("Table found")
except:
    print("Table not found")
    driver.quit()
    exit()

# Extract table headers
headers = [header.text for header in table.find_elements(By.TAG_NAME, "th")]
print("Headers:", headers)

# Extract table rows
rows = []
for row in table.find_elements(By.TAG_NAME, "tr")[1:]:  # Skip header row
    cells = row.find_elements(By.TAG_NAME, "td")
    rows.append([cell.text for cell in cells])

print("Rows extracted:", len(rows))

# Create a DataFrame
if headers and rows:
    df = pd.DataFrame(rows, columns=headers)
    # Save to CSV
    df.to_csv("vic_top_secondary_schools.csv", index=False)
    print("Data has been saved to vic_top_secondary_schools.csv")
else:
    print("No data to save")

# Close the WebDriver
driver.quit()

