//colorbrewer
//https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=6

// query url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


//// Creating the map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4.2
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Fetch the JSON data

d3.json(queryUrl).then(getData);

function getData(data) 
{

    console.log(data.features)

    //create earthquake Loop through the data.
    let earthquakes  = []
    for (let i = 0; i < data.features.length; i++) 
    {
        let earthquake = {
            lat: data.features[i].geometry.coordinates[1],
            lon: data.features[i].geometry.coordinates[0],
            depth: data.features[i].geometry.coordinates[2],
            mag: data.features[i].properties.mag
                        }
            earthquakes.push(earthquake);
        // .bindPopup(`<h1>${city.name}</h1> <hr> <h3>Population ${city.population.toLocaleString()}</h3>`)
    }
    console.log(earthquakes)

    var breaks = [-10, 10, 30,50,70, 90 ];
    
    for (let i = 0; i < earthquakes.length; i++) 
    {

        function getColor(depth) {
            return depth >= breaks[5] ? '#d73027' :
                   depth >= breaks[4]  ? '#fc8d59' :
                   depth >= breaks[3]  ? '#fee08b' :
                   depth >= breaks[2]  ? '#d9ef8b' :
                   depth >= breaks[1]   ? '#91cf60' :
                                 '#1a9850' ;
                   
                             }

    
        L.circleMarker([earthquakes[i].lat, earthquakes[i].lon], {
            radius : earthquakes[i].mag*2,
            color  : getColor(earthquakes[i].depth),
            opacity: .5
            
             
        }).bindPopup("<strong>" + "Location, Magnitude, Depth" 
                +"</strong><br /><br />Latitude: " + earthquakes[i].lat 
                +"</strong><br /><br />Longitude: " + earthquakes[i].lon
                +"</strong><br /><br />Magnitude: " + earthquakes[i].mag
                +"</strong><br /><br />Depth: " + earthquakes[i].depth
                ).addTo(myMap);


        

    }

 //Need to figure out the legend.  THIS IS STILL NOT WORKING
  
 var legend = L.control({position: 'bottomright'});
 legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  //loop through items and generate legend
  for (var i = 0; i < breaks.length; i++) {
  div.innterHTML += '<i style="background:' +  getColor(breaks[i]) + ' "></i> ' + labels[i] + (breaks ? ' ' + '<br>' : '');
  }
  return div;
 };
 legend.addTo(map);


}

 