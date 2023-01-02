import axios from 'axios';
import { Feature, Map, View } from 'ol';
import GeoJSON from 'ol/format/GeoJSON.js';
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
const baseUrl = 'http://127.0.0.1:3100/api'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZhcmhhbnJpemt5eXl5IiwiaWF0IjoxNjcyNDg0MTUyLCJleHAiOjE2NzI0OTEzNTJ9.dNQZMYeRj-lYVVHrrHqw7BDjkK79VQBqs8wJcL_4wLo'

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
  ],
  view: new View({
    // projection: 'EPSG:4326',
    // center: [107.679225, -6.746725],
    center: fromLonLat([107.679225, - 6.746725]),
    zoom: 9
  })
});

var markers = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    // zIndex: 1000,
    image: new Icon({
      scale: .035,
      src: 'assets/marker.png'
    })
  })
})

axios.get(`${baseUrl}/posts`).then((response) => {
  var array = response.data['data']
  array.forEach(e => {
    markersArray.push(e['coordinate']['coordinates'])
  });

  markersArray.forEach(e => {
    var marker = new Feature(new Point(fromLonLat(e)))
    // console.log(marker);
    markers.getSource().addFeature(marker)
  })

  map.addLayer(markers)
})

map.on('click', function (e) {
  var coordinate = map.getCoordinateFromPixel(e.pixel)
  console.log(coordinate);
  document.getElementById('postLon').value = coordinate[0]
  document.getElementById('postLat').value = coordinate[1]

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

  if (fromLon != '' && fromLat != '' && toLon != '' && toLat != '') {
    createRoute(fromLon, fromLat, toLon, toLat)
  }
})

const line = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    zIndex: 700,
    stroke: new Stroke({
      width: 7,
      color: 'green',
      lineDash: [10, 10]
    })
  })
})

async function createRoute(fromLon, fromLat, toLon, toLat) {
  const apiKey = '5b3ce3597851110001cf62482e90325d33734b4193345a80836635aa'
  axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${fromLon},${fromLat}&end=${toLon},${toLat}`).then(
    (response) => {
      console.log(response.data);

      line.getSource().addFeatures(new GeoJSON().readFeatures(response.data))
      map.addLayer(line)
      var features = response.data['features']
      var segments = features[0]['properties']['segments']
      var distance = segments[0]['distance']
      var duration = segments[0]['duration']
      document.getElementById('distance').innerHTML = `<p>Distance: ${distance}</p>`
      document.getElementById('duration').innerHTML = `<p>Duration: ${duration}</p>`
    }
  )

  axios.post(`${baseUrl}/route/create`, {
    'lat_from': fromLat,
    'long_from': fromLon,
    'lat_to': toLat,
    'long_to': toLon
  }).then((response) => {
    console.log(response.data);
  })
}

document.getElementById('reset').onclick = function () {
  map.removeLayer(line)
  document.getElementById('fromLon').value = ''
  document.getElementById('fromLat').value = ''
  document.getElementById('toLon').value = ''
  document.getElementById('toLat').value = ''
  selectedCoordinates.start = []
  selectedCoordinates.end = []
  document.getElementById('distance').innerHTML = `<p>Distance: </p>`
  document.getElementById('duration').innerHTML = `<p>Duration: </p>`
}

document.getElementById('post-reset').onclick = function () {
  document.getElementById('posts').value = ''
}

document.getElementById('post-btn').onclick = function () {
  var description = document.getElementById('posts').value
  var postLat = document.getElementById('postLat').value
  var postLon = document.getElementById('postLon').value

  if (description != '' && postLat != '' && postLon != '') {
    axios.post(`${baseUrl}/post/create`, {
      'description': description,
      'lat': postLat,
      'long': postLon
    }, {
      headers: {
        'x-access-token': token
      }
    }).then((response) => {
      console.log(response.data);
    })
  }
}
