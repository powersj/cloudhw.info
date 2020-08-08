#!/usr/bin/env python3
# Convert CSV file to JSON
#

import csv
import json

csv_filename = "instance-types.csv"
json_filename = "instance-types.json"

with open(csv_filename, 'r') as csv_file:
    reader = csv.DictReader(csv_file)
    data = list(reader)

for dictionary in data:
    dictionary['family_sort'] = int(dictionary['family_sort'])
    dictionary['cpu'] = int(dictionary['cpu'])
    try:
        dictionary['memory'] = int(dictionary['memory'])
    except ValueError:
        dictionary['memory'] = float(dictionary['memory'])

data = sorted(
    data, 
    key=lambda k: (k['cloud'], k['family'], ['family_sort'])
) 

with open(json_filename, 'w') as json_file:
    json.dump(data, json_file, indent=2, sort_keys=True)
