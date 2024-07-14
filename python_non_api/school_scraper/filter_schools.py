import pandas as pd

# Define input and output paths
csv_input_path = "/tmp/vic_top_secondary_schools_full.csv"
filtered_csv_output_path = "/tmp/filtered_vic_top_secondary_schools.csv"

# Load the data
df = pd.read_csv(csv_input_path)

# Filter out girls-only schools
df = df[~df['School'].str.contains("Girls|girl|girls", case=False, na=False)]

# Filter out schools outside Melbourne core
df = df[df['Postcode'].astype(str).str.startswith(('30', '31'))]

# Save the filtered data
df.to_csv(filtered_csv_output_path, index=False)

print(f"Filtered data has been saved to {filtered_csv_output_path}")
