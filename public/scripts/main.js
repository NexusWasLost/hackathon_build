import { renderMap, getLocation } from "./mapengine.js"
import { renderPlaces } from "./ui.js";
import { getCompanies } from "./company.js";

const latInputs = document.querySelectorAll(".lat");
const longInputs = document.querySelectorAll(".long");
const locationInputs = document.querySelectorAll(".address");
const goButtons = document.querySelectorAll(".go-btn"); //go-btn are for lat and long based search
const submitButtons = document.querySelectorAll(".address-submit"); //submit buttons are for textual city based search

let state = {
    lat: 51.505,
    long: -0.09,
    name: null,
    id: null,
    boundingBox: null,
    fullAddress: null
};

function render(){
    renderMap(state);
}
render();

const selectPlace = function (place) {
    state = place;
    render();
};

goButtons.forEach(function (btn, x) {
    btn.addEventListener("click", function () {
        state.lat = Number(latInputs[x].value);
        state.long = Number(longInputs[x].value);
        render();
    });
});
submitButtons.forEach(function (btn, x) {
    btn.addEventListener("click", async function () {
        let address = locationInputs[x].value;
        const result = await getLocation(address);
        if(result.length === 0) return;
        state = result[0];
        render();
        renderPlaces(result, selectPlace);
        getCompanies(state.boundingBox);
    });
});
