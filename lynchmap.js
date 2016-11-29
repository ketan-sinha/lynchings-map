$(document).ready(function(){
	console.log("Hey there");
	$.getJSON('lynchings.json', function(data){
		console.log('hi');
	});
});

var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 5,
	center: new google.maps.LatLng(37.09024, -100.712891) //Roughly the center of United States
});
