const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export const getCompanies = async function (boundingBox) {
    const south = boundingBox[0];
    const north = boundingBox[1];
    const west = boundingBox[2];
    const east = boundingBox[3];

    const query = `
        [out:json][timeout:25];

        (
            nwr["office"="it"](${south},${west},${north},${east});
            nwr["office"="telecommunication"](${south},${west},${north},${east});
            nwr["office"="company"]["company"~"^(software|robot)$"](${south},${west},${north},${east});
        );

        out center tags;
    `;

    try {
        const response = await fetch(OVERPASS_URL, {
            method: "POST",
            body: new URLSearchParams({ data: query })
        });

        if (!response.ok) {
            throw new Error(`Overpass returned HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log("Raw Overpass response:", data);
        console.log("Total results:", data.elements.length);
        console.table(data.elements);

        return data.elements;
    }
    catch (error) {
        console.error("Overpass request failed:", error);
        return [];
    }
};
