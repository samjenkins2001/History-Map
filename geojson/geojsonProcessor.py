import json
import subprocess
import os

class GeoJSONProcessor:
    def __init__(self, shp_file, shx_file, year, new_geojson, year_added_geojson):
        self.shp_file = shp_file
        self.shx_file = shx_file
        self.year = year
        self.new_geojson = new_geojson
        # self.main_geojson = main_geojson
        self.year_added_geojson = year_added_geojson

    def convert_shp_to_geojson(self):

        subprocess.run([
            'ogr2ogr', '-f', 'GeoJSON', self.new_geojson, self.shp_file
        ], check=True)

        print(f"Converted SHP to GeoJSON: {self.new_geojson}")

    def add_year_property(self):
        # Read the GeoJSON file
        with open(self.new_geojson, 'r', encoding='utf-8') as f:
            geojson_data = json.load(f)

        # Add "year": 2024 to each feature's properties
        for feature in geojson_data['features']:
            feature['properties']['year'] = self.year

        # Write the updated GeoJSON to a new file
        with open(self.year_added_geojson, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, ensure_ascii=False, indent=4)

        os.remove(self.new_geojson)
        print(f"Updated GeoJSON data written to {self.year_added_geojson}")

    def process(self):
        self.convert_shp_to_geojson()
        self.add_year_property()

if __name__ == "__main__":
    year = 1945
    shp_file = f'../raw_boundaries/cntry{year}.shp'
    shx_file = f'../raw_boundaries/cntry{year}.shx'
    new_geojson = f'year_data/new_{year}.geojson'
    year_added_geojson = f'year_data/{year}.geojson'


    processor = GeoJSONProcessor(shp_file, shx_file, year, new_geojson, year_added_geojson)
    processor.process()
