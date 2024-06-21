const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Use fs.promises for async operations
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'Front')));

// Endpoint to get GeoJSON data by year
app.get('/geojson/:year', async (req, res) => {
    const year = parseInt(req.params.year);

    try {
        // Read the GeoJSON file for the specified year asynchronously
        const filePath = path.join(__dirname, 'geojson', 'year_data', `${year}.geojson`);
        console.log('Attempting to read file:', filePath);
        
        const data = await fs.readFile(filePath, 'utf8');
        const geojsonData = JSON.parse(data);

        // Send the GeoJSON data for the specified year
        console.log(`Serving data for year: ${year}`);
        res.json(geojsonData);
    } catch (error) {
        // Handle file not found or JSON parsing errors
        console.error(`Error retrieving data for year ${year}: ${error.message}`);
        res.status(404).send('Data not found for the given year');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             res.status(404).send('Data not found for the given year');
//             return;
//         }

//         const geojsonData = JSON.parse(data);
//         const filteredFeatures = geojsonData.features.filter(feature => feature.properties.year == year);

//         if (filteredFeatures.length === 0) {
//             res.status(404).send("No data found for the given year");
//             return;
//         }

//         const filteredGeoJSON = {
//             type: "FeatureCollection",
//             features: filteredFeatures
//         };

//         console.log('Serving data for year: ${year}', filteredGeoJSON);
//         res.json(filteredGeoJSON);
//     });
