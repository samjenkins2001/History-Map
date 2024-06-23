document.addEventListener('DOMContentLoaded', function() {
    const yearDropdown = document.getElementById('year-dropdown');

    // Populate dropdown with years
    const years = [-2000, -1000, -500, -323, -200, -1, 400, 600, 800, 1000, 1279, 1492, 1530, 1650, 1715, 1783, 1815, 1880, 1914, 1920, 1938, 1945, 1994, 2024];
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
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

    yearDropdown.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const year = yearDropdown.value;
            if (year) {
                updateMap(year);
            } else {
                document.getElementById('error').textContent = 'Please select a year.';
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

    const tooltip = d3.select('body').append('div') //Added tooltip dev
        .attr('class', 'tooltip')
        .style('opacity', 0);

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
                    .attr('stroke', 'red')
                    .on('mouseover', function(event, d) {
                        const properties = d.properties;
                        tooltip.transition()
                            .duration(200)
                            .style('opacity', .9);
                        tooltip.html(`<strong>${properties.country}</strong><br>
                                      Ruler: ${properties.ruler}<br>
                                      Citizens: ${properties.citizens}`)
                            .style('left', (event.pageX + 10) + 'px')
                            .style('top', (event.pageY - 28) + 'px');
                        })
                        .on('mouseout', function(d) {
                            tooltip.transition()
                                .duration(500)
                                .style('opacity', 0);
                        });
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
