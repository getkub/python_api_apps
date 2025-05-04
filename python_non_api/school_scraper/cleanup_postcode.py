import csv
import re

input_file_path = '/tmp/top_secondary_schools_full.csv'
output_file_path = '/tmp/top_secondary_schools_clean.csv'

# Extract postcode from text
def extract_postcode(text):
    match = re.search(r'\b\d{4}\b', text)
    return match.group(0) if match else ''

# Extract school name, suburb, state, postcode from full field
def parse_school_field(field):
    # Example: "Alamanda K-9 College,Point Cook,VIC,3030"
    pattern = re.match(r'^(.*?),\s*([\w\s\-]+),\s*(VIC|NSW|QLD|SA|WA|TAS|NT|ACT),\s*(\d{4})$', field.strip())
    if pattern:
        school_name = pattern.group(1).strip()
        suburb = pattern.group(2).strip()
        state = pattern.group(3).strip()
        postcode = pattern.group(4).strip()
        return school_name, suburb, state, postcode
    else:
        # fallback
        return field.strip(), '', 'VIC', ''

# Process each row
def process_row(row):
    if not row or not row[0].strip().isdigit():
        return None  # skip invalid

    school_name, suburb, state, postcode = parse_school_field(row[1])

    return [
        row[0],                  # Order
        school_name,
        suburb,
        postcode,
        state,
        row[2] if len(row) > 2 else '',
        row[3] if len(row) > 3 else '',
        row[4] if len(row) > 4 else '',
        row[5] if len(row) > 5 else '',
        row[6] if len(row) > 6 else '',
        row[7] if len(row) > 7 else '',
        row[8] if len(row) > 8 else '',
        row[9] if len(row) > 9 else '',
    ]

# Run script
try:
    with open(input_file_path, 'r', newline='', encoding='utf-8') as infile, \
         open(output_file_path, 'w', newline='', encoding='utf-8') as outfile:
        
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        writer.writerow(["Order", "School", "Suburb", "Postcode", "State", "Overall Score",
                         "Better Education Percentile", "English", "Maths", "Total Enrolments",
                         "Trend / Compare", "Sector", "SES"])

        next(reader, None)  # skip header
        for row in reader:
            new_row = process_row(row)
            if new_row:
                writer.writerow(new_row)

    print(f"✅ Cleaned file written to {output_file_path}")

except Exception as e:
    print(f"❌ Error: {e}")
