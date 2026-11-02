document.addEventListener("DOMContentLoaded", function () {
    const latInputs = document.querySelectorAll(".lat");
    const longInputs = document.querySelectorAll(".long");
    const locationInputs = document.querySelectorAll(".address");
    const goButtons = document.querySelectorAll(".go-btn"); //go-btn are for lat and long based search
    const submitButtons = document.querySelectorAll(".address-submit"); //submit buttons are for textual city based search

    //This is maintained as the array of current valid places (changes each search)
    let global_loc = [];

    let map = initMap();
    let lat = 51.505; //default latitude
    let long = -0.09; //default longitude
    let marker = createMarker(lat, long, map);
    let polygon = null;

    //attach even listeners
    goButtons.forEach(function (btn, x) {
        btn.addEventListener("click", function () {
            lat = Number(latInputs[x].value);
            long = Number(longInputs[x].value);
            renderMap(lat, long, map);
            marker = updateMarker(lat, long, marker);
        });
    });
    submitButtons.forEach(function (btn, x) {
        btn.addEventListener("click", async function () {
            let address = locationInputs[x].value;
            global_loc = await getLocation(address);

            //re-render map, reset marker and update the bounding polygon
            renderMap(global_loc[0].lat, global_loc[0].long, map);
            marker = updateMarker(global_loc[0].lat, global_loc[0].long, marker);

            if(!polygon) createPolygon(global_loc[0].boundingBox, map);
            else polygon = updatePolygon(global_loc[0],boundingBox, polygon);
        });
    });

    renderMap(lat, long, map);
    marker = updateMarker(lat, long, marker);
});

function renderMap(lat, long, map) {
    map.setView([lat, long], 13);
}

function createMarker(lat, long, map) {
    let marker = L.marker([lat, long]).addTo(map);
    return marker;
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

function createPolygon(boundingBox, map) {
    let south = Number(boundingBox[0]);
    let north = Number(boundingBox[1]);
    let west = Number(boundingBox[2]);
    let east = Number(boundingBox[3]);

    let polygon = L.polygon([
        [south, west],
        [south, east],
        [north, east],
        [north, west]
    ]).addTo(map);

    return polygon;
}

function updatePolygon(boundingBox, polygon){
    let south = Number(boundingBox[0]);
    let north = Number(boundingBox[1]);
    let west = Number(boundingBox[2]);
    let east = Number(boundingBox[3]);

    polygon.setLatLng([
        [south, west],
        [south, east],
        [north, east],
        [north, west]
    ]);

    return polygon;
}

async function getLocation(locationString) {
    const params = new URLSearchParams({
        q: locationString,
        format: "json"
    });

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
        if (!response.ok) throw new Error();
        const jsonResponse = await response.json();
        const locations = formatLocationResponse(jsonResponse);
        return locations;
    }
    catch (error) {
        console.log("Failed to get location");
        return { message: "Failed to get location" };
    }
}

function formatLocationResponse(response) {
    let validLocations = [];

    for (let location of response) {
        if (location.addresstype == "city") {
            console.log(location); //for debuggin purposes

            validLocations.push({
                lat: location.lat,
                long: location.lon,
                boundingBox: location.boundingbox,
                name: location.name,
                id: location.place_id,
                fullAddress: location.display_name
            });
        }
    }

    return validLocations;
}
