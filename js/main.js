
async function getData() {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326 "
    const result = await fetch(url)
    const data = await result.json()

    const posUrl = "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f "
    const posResult = await fetch(posUrl)
    const posData = await posResult.json()

    const negUrl = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e "
    const negResult = await fetch(negUrl)
    const negData = await negResult.json()


    data.features.forEach(feature => {
        kuntaID = "KU" + feature.properties.kunta

        posIndex = posData.dataset.dimension.Tuloalue.category.index[kuntaID]
        feature.properties.positiveImmigration = posData.dataset.value[posIndex]

        negIndex = negData.dataset.dimension.Lähtöalue.category.index[kuntaID]
        feature.properties.negativeImmigration = negData.dataset.value[negIndex]
    });


    initMap(data)
}

function initMap(data) {
    let map = L.map("map")

    let geoJSON = L.geoJSON(data, {
        weight:2,
        onEachFeature:getFeature,
        style: getStyle
    }).addTo(map)
    
    let bounds = geoJSON.getBounds()
    map.fitBounds(bounds)
 

    let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: -3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function getFeature(feature, layer){
    id = feature.properties.kunta

    layer.bindTooltip(feature.properties.name)

    layer.bindPopup(
        `<ul>
            <li>negative immigration: ${feature.properties.negativeImmigration}</li>
            <li>positive immigration: ${feature.properties.positiveImmigration}</li>
        </ul>`
    )    

}

function getStyle(feature) {
    let hue = (feature.properties.positiveImmigration / feature.properties.negativeImmigration)**3 *60
    if (hue > 120){
        hue = 120
    }

    return {
        color: `hsl(${hue}, 75%, 50%)`
    }
}

getData()