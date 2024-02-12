
# Data Cleaning for Product Dataset

## Overview
This project aims to clean a product dataset by correcting inconsistencies in the 'Category' and 'Sub_Category' fields. The dataset contains various products, their categories, sub-categories, and other details. The primary goal is to ensure that each product is categorized correctly.

## Steps Involved

### 1. Data Inspection
The initial step involves inspecting the dataset to understand its structure and identify potential areas where issues may exist. The dataset contains the following fields:
- `Product_ID`: Unique identifier for each product
- `Product_Name`: Name of the product
- `Description`: Description of the product
- `Category`: General category of the product
- `Sub_Category`: Specific sub-category within the main category
- `Brand`: Brand of the product
- `Price`: Price of the product

### 2. Validation
The next step involves validating the data, particularly focusing on the 'Category' and 'Sub_Category' fields. The aim is to identify records where these fields are inconsistent with each other.

### 3. Correction
After identifying the inconsistencies, the dataset is corrected based on predefined mappings between the 'Category' and 'Sub_Category' fields. 

### 4. Verification
The corrected dataset is reviewed to ensure that the issues have been resolved.

### 5. Export
Finally, the cleaned and corrected dataset is saved as a new CSV file for subsequent use.

## Technologies Used
- Python
- Pandas

## Files
- `Extended_Product_Dataset.csv`: Original dataset
- `Corrected_Extended_Product_Dataset.csv`: Corrected dataset

## Usage
Run the Python script to automatically perform the data cleaning process. The script reads the original dataset, performs validation, applies corrections, and saves the corrected dataset.

```python
cleanData.py
```

## Conclusion
Data cleaning is an essential step in any data analytics or machine learning pipeline. This project demonstrates a simple yet effective method to clean a dataset by correcting inconsistencies in categorical fields.
