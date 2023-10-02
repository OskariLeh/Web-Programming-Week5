let positiveImmigration = {}
let negativeImmigration = {}

async function getData() {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326 "
    const result = await fetch(url)
    const data = await result.json()

    initMap(data)
}

function initMap(data) {
    let map = L.map("map")

    let geoJSON = L.geoJSON(data, {
        weight:2,
        onEachFeature:getFeature
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

}

getData()