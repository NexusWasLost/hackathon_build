export function updatePlaces(locations, updateMap) {
    const placesList = document.querySelector(".places-list");
    const placesCount = document.querySelector(".results-group:first-child .results-count");

    placesList.innerHTML = "";
    placesCount.textContent = locations.length;

    for (let location of locations) {
        const place = document.createElement("div");
        place.classList.add("place-item");

        place.dataset.lat = location.lat;
        place.dataset.long = location.long;

        const name = document.createElement("h4");
        name.textContent = location.name;

        const address = document.createElement("p");
        address.textContent = location.fullAddress;

        place.appendChild(name);
        place.appendChild(address);
        placesList.appendChild(place);

        document.querySelectorAll(".place-item").forEach(function (item) {
            item.classList.remove("active");
            item.addEventListener("click", function(){
                const currActiveItem = document.querySelector(".active");
                currActiveItem.classList.remove("active");
                item.classList.add("active");
            });
        });

        place.classList.add("active");

    }
}
