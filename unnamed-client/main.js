import axios from 'axios';
import { Feature, Map, View } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import './style.css';

var selectedCoordinates = {
  start: [],
  end: []
}

var markersArray = new Array

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
    center: fromLonLat([107.679225, -6.746725]),
    zoom: 9
  })
});

var markers = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    image: new Icon({
      scale: .035,
      src: 'assets/marker.png'
    })
  })
})

axios.get('http://127.0.0.1:3100/api/posts').then((response) => {
  var array = response.data['data']
  // console.log(array[0]['coordinate']['coordinates']);
  array.forEach(element => {
    markersArray.push(element['coordinate']['coordinates'])
  });

  for (let i = 0; i < markersArray.length; i++) {
    // console.log(markersArray[i]);
    var marker = new Feature(new Point(fromLonLat(markersArray[i])))
    markers.getSource().addFeature(marker)
  }

  map.addLayer(markers)
})

map.on('click', function (e) {
  console.log(map.getCoordinateFromPixel(e.pixel));
  var coordinate = map.getCoordinateFromPixel(e.pixel);
  if (selectedCoordinates.start.length == 0) {
    selectedCoordinates.start = coordinate
    document.getElementById('fromLon').value = selectedCoordinates.start[0]
    document.getElementById('fromLat').value = selectedCoordinates.start[1]
  } else {
    selectedCoordinates.end = coordinate
    document.getElementById('toLon').value = selectedCoordinates.end[0]
    document.getElementById('toLat').value = selectedCoordinates.end[1]
  }

  const fromLon = document.getElementById('fromLon').value
  const fromLat = document.getElementById('fromLat').value
  const toLon = document.getElementById('toLon').value
  const toLat = document.getElementById('toLat').value

  if (fromLon != null && fromLat != null && toLon != null && toLat != null) {
    // console.log(selectedCoordinates);
    createRoute(fromLon, fromLat, toLon, toLat)
  }
})

const line = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    stroke: new Stroke({
      width: 3,
      color: 'black'
    })
  })
})

function createRoute(fromLon, fromLat, toLon, toLat) {
  const apiKey = '5b3ce3597851110001cf62482e90325d33734b4193345a80836635aa'
  return axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${fromLon},${fromLat}&end=${toLon},${toLat}`).then(
    (response) => {
      console.log(response);

      line.getSource().addFeatures(new GeoJSON().readFeatures(response.data))
      map.addLayer(line)
    }
  )
}

document.getElementById('reset').onclick = function () {
  map.removeLayer(line)
  document.getElementById('fromLon').value = null
  document.getElementById('fromLat').value = null
  document.getElementById('toLon').value = null
  document.getElementById('toLat').value = null
  selectedCoordinates.start = []
  selectedCoordinates.end = []
}


