import { Feature, Map, View } from 'ol';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Text from 'ol/style/Text';
import './style.css';

var x = new Array

fetch('http://127.0.0.1:3100/api/posts').then(
  (response) => {
    return response.json()
  }
).then((response) => {
  var array = response['data']
  array.forEach(element => {
    x.push(element['coordinate']['coordinates'])
  });

  for (let i = 0; i < x.length; i++) {
    var marker = new Feature(new Point(fromLonLat(x[i])))
    markers.getSource().addFeature(marker)
  }
  console.log(x)
})

var markers = new VectorLayer({
  source: new VectorSource(),
  style: {
    'icon-scale': .04,
    'icon-src': 'src/marker.png'
  }
})

var text = new Text({
  text: 'Test',
})

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
  ],
  view: new View({
    // projection: 'EPSG:4326',
    center: fromLonLat([107.579225, -7.046725]),
    zoom: 8
  })
});

map.addLayer(markers)
