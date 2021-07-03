const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWthLWFzaG1pdCIsImEiOiJja3FsY3huM3MzempjMndtdjFhaG96MmllIn0.2dfhP9-mp9jwWtEJNzrroA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/aka-ashmit/ckqle2uy5lbsd17p8mdo0l7if',
  scrollZoom: false,
  // center: [-118.113, 34.111],
  // zoom: 10,
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //add popup
  new mapboxgl.Popup({ offset: 30, closeOnClick: false })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);
  //extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
