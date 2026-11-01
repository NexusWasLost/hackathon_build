document.addEventListener("DOMContentLoaded", function () {

    const latInput = document.querySelector(".lat");
    const longInput = document.querySelector(".long");

    let map = initMap();

    let lat = latInput.value || 51.505;
    let long = longInput.value || -0.09;
    const gobtn = document.querySelector(".go-btn");

    let marker = L.marker([lat, long]).addTo(map);

    gobtn.addEventListener("click", function () {
        lat = latInput.value;
        long = longInput.value;
        renderMap(lat, long, map);
        marker = updateMarker(lat, long, marker);
    });

    renderMap(lat, long, map);
    marker = updateMarker(lat, long, marker);
});

function renderMap(lat, long, map) {
    map.setView([lat, long], 13);
}

function updateMarker(lat, long, marker){
    marker.setLatLng([lat, long]);
    return marker;
}

function initMap(){
    let map = L.map("map");
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    return map;
}
