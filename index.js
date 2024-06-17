const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'Front')));

// Endpoint to get GeoJSON data by year
app.get('/geojson/:year', (req, res) => {
    const year = parseInt(req.params.year);
    const filePath = path.join(__dirname, 'geojson', 'current_map.geojson');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send('Data not found for the given year');
            return;
        }

        const geojsonData = JSON.parse(data);
        const filteredFeatures = geojsonData.features.filter(feature => feature.properties.year == year);

        if (filteredFeatures.length === 0) {
            res.status(404).send("No data found for the given year");
            return;
        }

        const filteredGeoJSON = {
            type: "FeatureCollection",
            features: filteredFeatures
        };

        console.log('Serving data for year: ${year}', filteredGeoJSON);
        res.json(filteredGeoJSON);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
