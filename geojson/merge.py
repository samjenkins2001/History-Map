import json


def merge(current_file: str, merge_file: str, output_file: str):

    # Read the current_map.geojson file
    with open(current_file, 'r', encoding='utf-8') as f:
        current_map_data = json.load(f)

    # Read the 2000BCE.geojson file
    with open(merge_file, 'r', encoding='utf-8') as f:
        data_merge = json.load(f)

    # Merge the features
    merged_features = current_map_data['features'] + data_merge['features']

    # Create the merged GeoJSON data
    merged_geojson_data = {
        "type": "FeatureCollection",
        "features": merged_features
    }

    # Write the merged GeoJSON to a new file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(merged_geojson_data, f, ensure_ascii=False, indent=4)

    print(f"Merged GeoJSON data written to {output_file}")

if __name__ == "__main__":
    merge("current_map.geojson", "year_data/1000BC.geojson", "current_map.geojson")