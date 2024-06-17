document.getElementById('load-data').addEventListener('click', function() {
    const year = document.getElementById('year-input').value;
    if (year) {
        updateMap(year);
    }
});

const width = 960;
const height = 600;

const svg = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height);

const projection = d3.geoMercator()
    .scale(150)
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
        .attr('fill', '#ccc')
});

function updateMap(year) {
    fetch(`/geojson/${year}`)
        .then(response => response.json())
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
        })
        .catch(error => {
            console.error('Error fetching GeoJSON data:', error);
        });
}