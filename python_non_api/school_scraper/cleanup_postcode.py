import csv
import re

# Define the input and output file paths
input_file_path = '/tmp/top_secondary_schools_full.csv'
output_file_path = '/tmp/top_secondary_schools_clean.csv'

# Function to extract postcode from a string
def extract_postcode(text):
    if not text:
        return ''
    # Find 4-digit number (Australian postcode)
    match = re.search(r'\b\d{4}\b', text)
    return match.group(0) if match else ''

# Function to clean suburb (remove state or postcode if present)
def clean_suburb(text):
    if not text:
        return ''
    # Remove known state abbreviations and postcodes
    text = re.sub(r',?\s*(VIC|NSW|QLD|SA|WA|TAS|NT|ACT)\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r',\s*\d{4}\b', '', text)
    return text.strip()

# Function to process each row
def process_row(row):
    # Check if Order is valid (non-empty and numeric)
    order = row[0].strip()
    if not order or not re.match(r'^\d+$', order):
        print(f"Skipping row (invalid or missing Order, likely an ad): {row}")
        return None

    print(f"Processing School column: {row[1]}")
    
    # Try to split the School column
    school_info = row[1].split(',')
    school_name = school_info[0].strip()
    
    # Initialize suburb and postcode
    suburb = ''
    postcode = ''
    
    # Attempt to extract suburb and postcode from school_info
    if len(school_info) > 1:
        # Try to find postcode in the last elements
        for item in reversed(school_info):
            postcode = extract_postcode(item)
            if postcode:
                break
        # Use remaining parts as suburb, excluding postcode and state
        remaining = [clean_suburb(item) for item in school_info[1:] if item.strip() and item.strip() != postcode]
        suburb = remaining[0] if remaining else ''
    
    # If no postcode found, try other columns
    if not postcode:
        for col in row[2:]:
            postcode = extract_postcode(col)
            if postcode:
                break
    
    state = "VIC"  # Default to VIC as per your data

    # Construct the new row
    new_row = [
        order,                # Order
        school_name,          # School name
        suburb,               # Suburb
        postcode,             # Postcode
        state,                # State
        row[2] if len(row) > 2 else '',  # Overall Score
        row[3] if len(row) > 3 else '',  # Better Education Percentile
        row[4] if len(row) > 4 else '',  # English
        row[5] if len(row) > 5 else '',  # Maths
        row[6] if len(row) > 6 else '',  # Total Enrolments
        row[7] if len(row) > 7 else '',  # Trend / Compare
        row[8] if len(row) > 8 else '',  # Sector
        row[9] if len(row) > 9 else ''   # SES
    ]
    return new_row

# Open the input CSV and output CSV files
try:
    with open(input_file_path, mode='r', newline='', encoding='utf-8') as infile, \
         open(output_file_path, mode='w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        # Write header to output file
        header = ["Order", "School", "Suburb", "Postcode", "State", "Overall Score", 
                  "Better Education Percentile", "English", "Maths", "Total Enrolments", 
                  "Trend / Compare", "Sector", "SES"]
        writer.writerow(header)

        # Skip header row in input file
        next(reader, None)
        
        # Process each row and write to output file
        for row in reader:
            if row:  # Skip empty rows
                new_row = process_row(row)
                if new_row:  # Only write valid rows
                    writer.writerow(new_row)
except FileNotFoundError:
    print(f"Error: Input file {input_file_path} not found.")
    exit(1)
except Exception as e:
    print(f"Error processing CSV: {e}")
    exit(1)

print(f"Data has been converted and saved to {output_file_path}")