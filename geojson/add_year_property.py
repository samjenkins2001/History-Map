import json

# Path to the GeoJSON file
input_file = 'current_map.geojson'
output_file = 'current_map_updated.geojson'
year_to_add = 2024

# Read the GeoJSON file
with open(input_file, 'r', encoding='utf-8') as f:
    geojson_data = json.load(f)

# Add "year": 2024 to each feature's properties
for feature in geojson_data['features']:
    feature['properties']['year'] = year_to_add

# Write the updated GeoJSON to a new file
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(geojson_data, f, ensure_ascii=False, indent=4)

print(f"Updated GeoJSON data written to {output_file}")
