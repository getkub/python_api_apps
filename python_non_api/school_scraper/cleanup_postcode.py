import csv

# Define the input and output file paths
input_file_path = '/tmp/top_secondary_schools_full.csv'  # Replace with the actual input file path
output_file_path = '/tmp/top_secondary_schools_clean.csv'  # Define the desired output file path

# Function to process each row
def process_row(row):
    # Split the school info to extract name, suburb, and postcode
    school_info = row[1].split(',')
    school_name = school_info[0]
    suburb = school_info[1] if len(school_info) > 1 else ''
    postcode = school_info[-2] if len(school_info) > 2 else ''
    state = "VIC"  # Set state as VIC

    # Construct the new row with extracted and reformatted fields
    new_row = [
        row[0],               # Order
        school_name,          # School name
        suburb,               # Suburb
        postcode,             # Postcode
        state,                # State (VIC)
        row[2],               # Overall Score
        row[3],               # Better Education Percentile
        row[4],               # English
        row[5],               # Maths
        row[6],               # Total Enrolments
        row[7],               # Trend / Compare
        row[8],               # Sector
        row[9]                # SES
    ]
    return new_row

# Open the input CSV and output CSV files
with open(input_file_path, mode='r', newline='') as infile, open(output_file_path, mode='w', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    # Write header to output file
    header = ["Order", "School", "Suburb", "Postcode", "State", "Overall Score", "Better Education Percentile", "English", "Maths", "Total Enrolments", "Trend / Compare", "Sector", "SES"]
    writer.writerow(header)

    # Process each row and write to output file
    for row in reader:
        new_row = process_row(row)
        writer.writerow(new_row)

print(f"Data has been converted and saved to {output_file_path}")
