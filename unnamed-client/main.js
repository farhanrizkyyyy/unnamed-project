import axios from 'axios';
import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import './style.css';

var x = new Array

// fetch('http://127.0.0.1:3100/api/posts').then(
//   (response) => {
//     return response.json()
//   }
// ).then((response) => {
//   var array = response['data']
//   array.forEach(element => {
//     x.push(element['coordinate']['coordinates'])
//   });

//   for (let i = 0; i < x.length; i++) {
//     var marker = new Feature(new Point(fromLonLat(x[i])))
//     markers.getSource().addFeature(marker)
//     // markers.on('click', function () {
//     //   console.log('test');
//     // })
//     // marker.on('click', function () {
//     //   console.log('test');
//     // })
//   }
// })

axios.get('http://127.0.0.1:3100/api/posts').then(
  (response) => {
    console.log(response);
  }
).then((response) => {
  var array = response['data']
//   array.forEach(element => {
//     x.push(element['coordinate']['coordinates'])
//   });

//   for (let i = 0; i < x.length; i++) {
//     var marker = new Feature(new Point(fromLonLat(x[i])))
//     markers.getSource().addFeature(marker)
//     // markers.on('click', function () {
//     //   console.log('test');
//     // })
//     // marker.on('click', function () {
//     //   console.log('test');
//     // })
})

var markers = new VectorLayer({
  source: new VectorSource(),
  style: {
    'icon-scale': .04,
    'icon-src': 'assets/marker.png'
  }
})

markers.on('click', function () {
  console.log('test');
})

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    // straitsLayer
  ],
  view: new View({
    // projection: 'EPSG:4326',
    center: fromLonLat([107.579225, -7.046725]),
    zoom: 8
  })
});

const straitSource = new VectorSource({ wrapX: true });
var straitsLayer = new VectorLayer({
  source: straitSource
});

var popup = new Overlay({
  element: document.getElementById('popup'),
})

map.addLayer(markers)
map.addOverlay(popup)
map.on('hover', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
    return feat;
  });

  if (feature && feature.get('type') == 'Point') {
    var coordinate = evt.coordinate;

    content.innerHTML = feature.get('desc');
    popup.setPosition(coordinate);
  }
  else {
    popup.setPosition(undefined);
  }
});
