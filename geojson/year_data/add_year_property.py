import json


def add_year(input: str, output: str, year: int):
    # Path to the GeoJSON file
    input_file = input
    output_file = output
    year_to_add = year

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

if __name__ == "__main__":
    add_year("1000BC.geojson", "1000BC.geojson", -1000)
