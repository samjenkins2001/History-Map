document.getElementById('year-input').addEventListener('input', function() {
    const year = this.value;
    if (year) {
        updateMap(year);
    }
});

const map = L.map('map').setView([20, 0], 2); // Center map at (20, 0) with zoom level 2

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function updateMap(year) {
    // Placeholder function - you will need to implement the logic to update the map
    console.log(`Updating map to the year: ${year}`);
    // For example, you might change the displayed layers based on the year
}