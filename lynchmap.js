var mapMarkers = [];
var iw = new google.maps.InfoWindow();
var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 5,
	center: new google.maps.LatLng(37.09024, -100.712891), //Roughly the center of United States
	mapTypeId: 'terrain',
	styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}],
	mapTypeControl: false,
	streetViewControl: false,
	scaleControl: true
});

var oms = new OverlappingMarkerSpiderfier(map, {
	keepSpiderfied: false,
	nearbyDistance: 20,
	legWeight: 3
});

const COLORS_LANGS = {				//Race to button color mapping
	"Italian" : "purple",
	"Native American" : "green",
	"Hispanic" : "pink",
	"Chinese" : "brown",
	"Japanese" : "blue",
	"White" : "red",
	"Black" : "yellow"
};

oms.addListener('click', function(marker){				//Adds infobox popup on marker click
	iw.setContent(marker.desc);
	iw.open(map, marker);
});

$(document).ready(function(){										//Initialize map with lynch markers
	$.getJSON('db/lynchings.json', function(json){
		console.log('Loaded lynchings.json');
		$.each(json.features, function(index, data){	//Iterates through features[]
			var coords = data.geometry.coordinates;
			var marker = new google.maps.Marker({		//Begin adding map data to markers
				position: new google.maps.LatLng(coords[1], coords[0]),
				icon: 'img/gray_button.png',					//Default icon button is gray
				map: map,
				year: data.properties.Year,
				desc: '<div id="content">'+								//Creates description textbox
				'<div id="siteNotice">'+
				'</div>'+
				'<h1 id="firstHeading" class="firstHeading">'+ data.properties.Name +'</h1>'+
				'<div id="bodyContent">'+
				'<p><i>'+ data.properties.Race + ' ' +
									data.properties.Gender + ' ' +
									data.properties.Age + '</i><p>' +
				'<p><b>'+ data.properties.Year + '/' +
									data.properties.Month + '/' +
									data.properties.Day + '</b></p>' +
				'<p><i>Accusation:</i> ' + data.properties.Accusation + '</p>' +
				'<p><i>Death:</i> ' + data.properties["Method of Death"] + '</p>' +
				'</div>'+
				'</div>'
			});

			mapMarkers.push(marker);							//Add marker to mapMarkers array
			oms.addMarker(marker);								//Add marker to OMS

			Object.keys(COLORS_LANGS).forEach(function(language){		//Set button according to marker.Race
				if(data.properties.Race.search(language) !== -1){			//Search through COLORS_LANGS
					marker.setIcon('img/' + COLORS_LANGS[language] + '_button.png');
				}
			});
		});
	});
});
