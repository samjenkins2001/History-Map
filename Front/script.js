document.addEventListener('DOMContentLoaded', function() {

    // Populate dropdown with years
    const years = [-2000, -1000, -500, -323, -200, -1, 400, 600, 800, 1000, 1279, 1492, 1530, 1650, 1715, 1783, 1815, 1880, 1914, 1920, 1938, 1945, 1994, 2024];
    const yearDropdown = document.getElementById('year-dropdown');

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year < 0 ? `${Math.abs(year)} BCE` : year;  // Format BCE years
        yearDropdown.appendChild(option);
    });

    document.getElementById('load-data').addEventListener('click', function() {
        const year = yearDropdown.value;
        if (year) {
            updateMap(year);
        } else {
            document.getElementById('error').textContent = 'Please select a year.';
        }
    });

    yearDropdown.addEventListener('change', function() {
        document.getElementById('error').textContent = '';
    });

    yearDropdown.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('load-data').click();
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

    const tooltip = d3.select('body').append('div') //Added tooltip dev
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Draw a blank world map
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(function(data) {
        drawMap(data);
    });
    
    function drawMap(data) {
        svg.selectAll('path').remove();
        svg.append('g')
            .selectAll('path')
            .data(data.features)
            .enter().append('path')
            .attr('d', path)
            .attr('class', 'country')
            .attr('fill', '#ccc')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .on('mouseover', function(event, d) {
                const properties = d.properties;
                if (properties.country) {
                    clearTimeout(tooltipTimeout);
                    
                    tooltip.style("visibility", "visible")
                        .transition()
                        .duration(200)
                        .style('opacity', .9);

                    tooltip.html(`<strong>
                                    <a href="${properties.country.url}" target="_blank">${properties.country.label}</a>
                                </strong><br>
                                <a href="${properties.ruler.url}" target="_blank">${properties.ruler.label}</a><br>
                                Citizens: ${properties.population}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                }
            })
            .on('mouseout', function() {
                tooltipTimeout = setTimeout(function() {
                    tooltip.transition()
                    .duration(500)
                    .style('opacity', 0)
                    .on("end", function() {
                        tooltip.style("visibility", "hidden");
                    });
            }, 2000);
        });
}

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
                drawMap(data);
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
});
