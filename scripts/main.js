// Set api token for mapbox
	mapboxgl.accessToken = 'pk.eyJ1Ijoic21vbnRpY2V1ZXgiLCJhIjoiY2tjNjJ2MjZ2MG5ncDMwbzBhbnlycGVhdCJ9.EoP1fgtZHEBui1VWM_pV8A';
	
// api token for openWeatherMap
	var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
	var openWeatherMapUrlApiKey = '4ae86f49ba7618852f0a7820f618d869';
	
	
// Get the current weather conditions based on city input
	var button = document.querySelector('.button');
	var inputValue = document.querySelector('.inputValue');
	var name = document.querySelector('.name');
	var desc = document.querySelector('.desc');
	var temp = document.querySelector('.temp');


// Display results of city input by user 
	button.addEventListener('click', function() {
	fetch('http://api.openweathermap.org/data/2.5/weather?q='+inputValue.value+'&units=imperial&appid=4ae86f49ba7618852f0a7820f618d869')
	.then(response => response.json())
	.then(data=> {
		var nameValue = data['name'];
		var tempValue = Math.floor(data['main']['temp']);
		var descValue = data['weather'][0]['description'];
		
		
		name.innerHTML = nameValue;
		temp.innerHTML = tempValue; 
		desc.innerHTML = descValue; 
		})

    .catch(err => alert("Incorrect City Name!"))
})	
	
// Determine cities
	var cities = [
	  {
		name: 'Florida',
		coordinates: [-80.651, 28.572]
	  },
	  {
		name: 'Kansas',
		coordinates: [-91.247, 33.582]
	  },
	  {
		name: 'Texas',
		coordinates: [-95.097, 29.549]
	  }
	];

// Initiate map
	var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [-87, 30.8],
	zoom: 5
	});
	
// get weather data and plot on map
	map.on('load', function () {
	  cities.forEach(function(city) {
	   
		var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

		// Get current weather based on cities' coordinates
		fetch(request)
		  .then(function(response) {
			if(!response.ok) throw Error(response.statusText);
			return response.json();
		  })
		  .then(function(response) {
			// Then plot the weather response + icon on MapBox
			plotImageOnMap(response.weather[0].icon, city)
		  })
		  .catch(function (error) {
			console.log('ERROR:', error);
		  });
	  });
	});
 
 function plotImageOnMap(icon, city) {
  map.loadImage(
    'http://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1.5
        }
      });
    }
  );
}

	map.on('load', function() {
	 map.addSource('places', {
		'type': 'geojson',
		'data': {
		'type': 'FeatureCollection',
		'features': [
		{
		'type': 'Feature',
		'properties': {
		'description':
		'<strong>Kennedy Space Center</strong>'+
		'<p>Florida, US</p>',
		'icon': 'rocket'
		},
		'geometry': {
		'type': 'Point',
		'coordinates': [-80.651, 28.572]
		}
		},
		{
		'type': 'Feature',
		'properties': {
		'description':
		'<strong>U.S. Space & Rocket Center</strong>'+ 
		'<p>Kansas, US</p>',
		'icon': 'rocket'
		},
		'geometry': {
		'type': 'Point',
		'coordinates': [-91.247, 33.582]
		}
		},
		{
		'type': 'Feature',
		'properties': {
		'description':
		'<strong>Space Center Houston</strong>'+
		'<p>Texas, US</p>',
		'icon': 'rocket'
		},
		'geometry': {
		'type': 'Point',
		'coordinates': [-95.097, 29.549]
	    }
	   }
	  ]
	 }
	});
	
// Add a layer showing the places.
	map.addLayer({
	'id': 'places',
	'type': 'symbol',
	'source': 'places',
	'layout': {
	'icon-image': '{icon}-15',
	'icon-allow-overlap': true
	}
	});
	
	 
// When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
	map.on('mouseenter', 'places', function(e) {
// Change the cursor style as a UI indicator.
	map.getCanvas().style.cursor = 'pointer';
	var coordinates = e.features[0].geometry.coordinates.slice();
	var description = e.features[0].properties.description;
	 
	
	while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
	coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
	}
	 
	new mapboxgl.Popup()
	.setLngLat(coordinates)
	.setHTML(description)
	.addTo(map);
	});
 
// Change the cursor to a pointer when the mouse is over the places layer.
	map.on('mouseenter', 'places', function() {
	map.getCanvas().style.cursor = 'pointer';
	});
 
// Change it back to a pointer when it leaves.
	map.on('mouseleave', 'places', function() {
	map.getCanvas().style.cursor = '';
	});
	
    });

