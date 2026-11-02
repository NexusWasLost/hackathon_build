export const renderPlaces = function (places, selectPlace) {
    const placesList = document.querySelector(".places-list");
    const placesCount = document.querySelector(".results-group:first-child .results-count");

    placesList.innerHTML = "";
    placesCount.textContent = places.length;

    places.forEach(function (location, idx) {
        const place = document.createElement("div");
        place.classList.add("place-item");
        if(idx === 0) place.classList.add("active");

        const name = document.createElement("h4");
        name.textContent = location.name;

        const address = document.createElement("p");
        address.textContent = location.fullAddress;

        place.appendChild(name);
        place.appendChild(address);

        place.addEventListener("click", function () {
            const active = placesList.querySelector(".active");
            if (active) active.classList.remove("active");
            place.classList.add("active");
            selectPlace(location);
        });

        placesList.appendChild(place);
    });
};
