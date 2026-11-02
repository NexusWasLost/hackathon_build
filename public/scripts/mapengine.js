let map = initMap();
let marker = L.marker([0, 0]).addTo(map);
let polygon = null;

export const renderMap = function (state) {
    map.setView([state.lat, state.long], 13);
    marker.setLatLng([state.lat, state.long]);

    if (polygon) {
        polygon.remove();
        polygon = null;
    }
    if (!state.boundingBox) return;

    const south = Number(state.boundingBox[0]);
    const north = Number(state.boundingBox[1]);
    const west = Number(state.boundingBox[2]);
    const east = Number(state.boundingBox[3]);

    polygon = L.polygon([
        [south, west],
        [south, east],
        [north, east],
        [north, west]
    ]).addTo(map);
}

function initMap() {
    let map = L.map("map");
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    return map;
}

export const getLocation = async function (locationString) {
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
        return [];
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
