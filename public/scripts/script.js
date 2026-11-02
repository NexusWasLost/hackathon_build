document.addEventListener("DOMContentLoaded", function () {

    const latInput = document.querySelector(".lat");
    const longInput = document.querySelector(".long");
    const locationInput = document.querySelector(".address");
    const gobtn = document.querySelector(".go-btn");
    const submitbtn = document.querySelector(".address-submit");

    let lat = latInput.value || 51.505;
    let long = longInput.value || -0.09;

    let map = initMap();
    let marker = createMarker(lat, long, map);

    gobtn.addEventListener("click", function () {
        lat = latInput.value;
        long = longInput.value;
        renderMap(lat, long, map);
        marker = updateMarker(lat, long, marker);
    });

    submitbtn.addEventListener("click", async function () {
        let address = locationInput.value;
        const loc = await getLocation(address);
        renderMap(loc[0].lat, loc[0].lon, map);
        console.log(loc);
        marker = updateMarker(loc[0].lat, loc[0].lon, marker);
    });

    renderMap(lat, long, map);
    marker = updateMarker(lat, long, marker);
});

function renderMap(lat, long, map) {
    map.setView([lat, long], 13);
}

function updateMarker(lat, long, marker) {
    marker.setLatLng([lat, long]);
    return marker;
}

function initMap() {
    let map = L.map("map");
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    return map;
}

function createMarker(lat, long, map) {
    let marker = L.marker([lat, long]).addTo(map);
    return marker;
}

async function getLocation(locationString) {
    console.log(locationString);
    const params = new URLSearchParams({
        q: locationString,
        format: "json"
    });

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
        if (!response.ok) throw new Error();
        const jsonResponse = await response.json();
        return jsonResponse;
    }
    catch (error) {
        console.log("Failed to get location");
        return { message: "Failed to get location" };
    }
}
