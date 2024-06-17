import json
import os
import fiona
from fiona.transform import transform_geom
from fiona.crs import from_epsg

class GeoJSONProcessor:
    def __init__(self, shp_file, shx_file, year, new_geojson, main_geojson, year_added_geojson):
        self.shp_file = shp_file
        self.shx_file = shx_file
        self.year = year
        self.new_geojson = new_geojson
        self.main_geojson = main_geojson
        self.year_added_geojson = year_added_geojson

    #Incomplete, haven't solved source/dest issue
    def convert_shp_to_geojson(self):

        source_crs = from_epsg(4326)
        dest_crs = from_epsg(4326)

        with fiona.open(self.shp_file, crs=source_crs) as source:
            features = []
            for feature in source:
                transformed_geom = transform_geom(
                    source.crs, dest_crs, feature['geometry']
                )
                features.append({
                    "type": "Feature",
                    "properties": feature['properties'],
                    "geometry": transformed_geom
                })

        geojson_data = {
            "type": "FeatureCollection",
            "features": features
        }

        with open(self.new_geojson, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, ensure_ascii=False, indent=4)

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

        print(f"Updated GeoJSON data written to {self.year_added_geojson}")

    def merge(self):
        with open(self.main_geojson, 'r', encoding='utf-8') as f:
            main_data = json.load(f)

        with open(self.year_added_geojson, 'r', encoding='utf-8') as f:
            new_data = json.load(f)

        merged_features = main_data['features'] + new_data['features']

        merged_geojson_data = {
            "type": "FeatureCollection",
            "features": merged_features
        }

        with open(self.main_geojson, 'w', encoding='utf-8') as f:
            json.dump(merged_geojson_data, f, ensure_ascii=False, indent=4)

        print(f"Merged GeoJSON data into: {self.main_geojson}")

    def process(self):
        # self.convert_shp_to_geojson()
        self.add_year_property()
        self.merge()

if __name__ == "__main__":
    shp_file = '../raw_boundaries/cntry323bc.shp'
    shx_file = '../raw_boundaries/cntry323bc.shx'
    year = -323
    new_geojson = f'year_data/{year}.geojson'
    year_added_geojson = f'year_data/feature_{year}.geojson'
    main_geojson = 'current_map.geojson'


    processor = GeoJSONProcessor(shp_file, shx_file, year, new_geojson, main_geojson, year_added_geojson)
    processor.process()
