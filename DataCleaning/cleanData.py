import pandas as pd

# Load the dataset
dataset_path = 'Extended_Product_Dataset.csv'  # Update the path as needed
df = pd.read_csv(dataset_path)

# Define a mapping between categories and valid sub-categories
category_subcategory_mapping = {
    'Television': ['4K TVs'],
    'Home Appliances': ['Washing Machines', 'Vacuum Cleaners', 'Refrigerators'],
    'Mobile Phones': ['Smartphones'],
    'Audio': ['Headphones'],
    'Computers': ['Laptops'],
    'Cameras': ['DSLR Cameras'],
    'Kitchen Appliances': ['Coffee Machines', 'Microwave Ovens']
}

# Initialize a list to hold records that have inconsistencies
inconsistent_records = []

# Loop through each record in the DataFrame
for index, row in df.iterrows():
    category = row['Category']
    sub_category = row['Sub_Category']
    
    # Check if the sub-category is valid for the given category
    if sub_category not in category_subcategory_mapping.get(category, []):
        inconsistent_records.append(row)

# Convert the list of inconsistent records to a DataFrame for better visualization
df_inconsistent = pd.DataFrame(inconsistent_records)

# Create a reversed mapping from sub-category to category for easy look-up
subcategory_category_mapping = {sub: cat for cat, sub_list in category_subcategory_mapping.items() for sub in sub_list}

# Correct the 'Category' based on the 'Sub_Category' using the mapping
df['Corrected_Category'] = df['Sub_Category'].map(subcategory_category_mapping)

# Replace the original 'Category' with the corrected one
df['Category'] = df['Corrected_Category']

# Drop the temporary 'Corrected_Category' column
df.drop(columns=['Corrected_Category'], inplace=True)

# Save the corrected DataFrame to a new CSV file
corrected_dataset_path = 'Corrected_Extended_Product_Dataset.csv'  # Update the path as needed
df.to_csv(corrected_dataset_path, index=False)
