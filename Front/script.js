document.getElementById('load-data').addEventListener('click', function() {
    const year = document.getElementById('year-input').value;
    if (year) {
        updateMap(year);
    }
});

document.getElementById('year-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const year = document.getElementById('year-input').value;
        if (year) {
            updateMap(year);
        }
    }
});

const width = 960;
const height = 600;

const svg = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

const projection = d3.geoMercator()
    .scale(width / 6.3)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Draw a blank world map
d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(function(data) {
    svg.append('g')
        .selectAll('path')
        .data(data.features)
        .enter().append('path')
        .attr('d', path)
        .attr('class', 'country')
        // .attr('fill', '#ccc')
});

function updateMap(year) {
    fetch(`/geojson/${year}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Data not found for the given year');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Received data for year ${year}:`, data);
            svg.selectAll('.boundary').remove();
            svg.append('g')
                .selectAll('path')
                .data(data.features)
                .enter().append('path')
                .attr('d', path)
                .attr('class', 'boundary')
                .attr('fill', 'none')
                .attr('stroke', 'red');
            document.getElementById('error').textContent = '';
        })
        .catch(error => {
            console.error('Error fetching GeoJSON data:', error);
            document.getElementById('error').textContent = error.message; // Display error message
        });
}

window.addEventListener('resize', function() {
    const newWidth = document.getElementById('map').clientWidth;
    const newHeight = 600;
    
    svg.attr('viewBox', `0 0 ${newWidth} ${newHeight}`);

    projection
        .scale(newWidth / 6.3)
        .translate([newWidth / 2, newHeight / 2]);

    svg.selectAll('path').attr('d', path);
});