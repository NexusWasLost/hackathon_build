document.addEventListener("DOMContentLoaded", function () {
    const latInputs = document.querySelectorAll(".lat");
    const longInputs = document.querySelectorAll(".long");
    const locationInputs = document.querySelectorAll(".address");
    const goButtons = document.querySelectorAll(".go-btn");
    const submitButtons = document.querySelectorAll(".address-submit");

    let lat = 51.505;
    let long = -0.09;

    let map = initMap();
    let marker = createMarker(lat, long, map);

    //attach even listeners
    goButtons.forEach(function(btn, x){
        btn.addEventListener("click", function(){
            lat = Number(latInputs[x].value);
            long = Number(longInputs[x].value);
            renderMap(lat, long, map);
            marker = updateMarker(lat, long, marker);
        })
    });
    submitButtons.forEach(function(btn, x){
        btn.addEventListener("click", async function(){
            let address = locationInputs[x].value;
            const loc = await getLocation(address);
            renderMap(loc[0].lat, loc[0].long, map);
            marker = updateMarker(loc[0].lat, loc[0].long, marker);
        })
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

function formatLocationResponse(response){
    let validLocations = [];

    for(let location of response){
        if(location.addresstype == "city"){
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
