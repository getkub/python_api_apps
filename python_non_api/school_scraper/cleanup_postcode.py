import csv
import re

input_file_path = '/tmp/top_secondary_schools_full.csv'
output_file_path = '/tmp/top_secondary_schools_clean.csv'

# Extract postcode from text
def extract_postcode(text):
    match = re.search(r'\b\d{4}\b', text)
    return match.group(0) if match else ''

# Extract suburb from school name if it contains location reference
def extract_suburb_from_name(school_name):
    # Common patterns where school name contains location
    location_patterns = [
        # Pattern: "Mount Waverley Secondary College"
        r'^(Mount\s+\w+|Box\s+Hill|Glen\s+\w+|Point\s+\w+|Brighton\s+\w*|St\s+Kilda\s+\w*)\s',
        # Pattern: "Balwyn High School" - extract location before "High School", "Secondary College", etc.
        r'^(\w+)\s+(High School|Secondary College|College|Grammar)',
        # Other common suburb naming patterns
        r'^(\w+\s+\w+)\s+(High School|Secondary College|College|Grammar)'
    ]
    
    for pattern in location_patterns:
        match = re.search(pattern, school_name)
        if match:
            return match.group(1)
    
    return ''

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
        # If no suburb info found, extract school name and try to find suburb in name
        school_name = field.strip()
        postcode = extract_postcode(field)
        
        # Remove quotes if present
        if school_name.startswith('"') and school_name.endswith('"'):
            school_name = school_name[1:-1]
            
        suburb = extract_suburb_from_name(school_name)
        return school_name, suburb, 'VIC', postcode

# Process each row
def process_row(row):
    if not row or not row[0].strip() or not row[0].strip().isdigit():
        return None  # skip invalid rows
    
    try:
        order = row[0].strip()
        
        # Process the school field
        school_name, suburb, state, postcode = parse_school_field(row[1])
        
        # If no postcode was found in the school field, use the one from the third column
        if not postcode and len(row) > 2:
            postcode = row[2]
            
        # If still no suburb, make a second pass to try and extract it from the school name
        if not suburb:
            suburb = extract_suburb_from_name(school_name)
        
        return [
            order,                  # Order
            school_name,
            suburb,
            postcode,
            state,
            row[3] if len(row) > 3 else '',  # Overall Score
            row[4] if len(row) > 4 else '',  # Better Education Percentile
            row[5] if len(row) > 5 else '',  # English
            row[6] if len(row) > 6 else '',  # Maths
            row[7] if len(row) > 7 else '',  # Total Enrolments
            row[8] if len(row) > 8 else '',  # Trend / Compare
            row[9] if len(row) > 9 else '',  # Sector
            row[10] if len(row) > 10 else '' # SES
        ]
    except Exception as e:
        print(f"Error processing row {row}: {e}")
        return None

# Run script
try:
    with open(input_file_path, 'r', newline='', encoding='utf-8') as infile, \
         open(output_file_path, 'w', newline='', encoding='utf-8') as outfile:
        
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        # Write header
        writer.writerow(["Order", "School", "Suburb", "Postcode", "State", "Overall Score",
                         "Better Education Percentile", "English", "Maths", "Total Enrolments",
                         "Trend / Compare", "Sector", "SES"])

        # Skip header row from input
        header = next(reader, None)
        
        # Process remaining rows
        for row in reader:
            if not row or len(row) < 2:
                continue  # Skip empty rows
                
            new_row = process_row(row)
            if new_row:
                writer.writerow(new_row)
                
        print(f"✅ Cleaned file written to {output_file_path}")

except Exception as e:
    print(f"❌ Error: {e}")