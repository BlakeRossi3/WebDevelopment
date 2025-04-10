const init = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmxha2Vyb3NzaSIsImEiOiJjbTk4cTMxZ20wNWpwMnNxM2V3d2ttb3g1In0.Opw0G6Zc62lMp1kZ34CbAQ';

    const geojson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-77.032, 38.913]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'Washington, D.C.'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-122.414, 37.776]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'San Francisco, California'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-115.7930, 37.2431]
    
                },
                properties: {
                    title: 'Area 51',
                    description: 'Lincoln County, Nevada'
                }
            }
    
        ]
    };
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-96, 37.8],
        zoom: 3
    });
    
    
    for (const feature of geojson.features) {
    
        const el = document.createElement('div');
        el.className = 'marker';
    
    
        new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).addTo(map);
        new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
    
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
            )
            .addTo(map);
    }

}
export {init};