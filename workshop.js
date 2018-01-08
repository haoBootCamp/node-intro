var request = require('request-promise');

// Euclidian distance between two points
function getDistance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

function getIssPosition() {
  return request("http://api.open-notify.org/iss-now.json")
  .then(
    function(response) {
    	 // Parse as JSON
    	var obj = JSON.parse(response)
    	
      return {
	    		lng: obj.iss_position.longitude,
	    		lat: obj.iss_position.latitude
    		};
    }
  )
  .catch(function(err){
  	console.log(err, "request rejected")
  }
  );
}
	

function getAddressPosition(address) {
	var API= "AIzaSyD0EATvKKPI5_bcEYZ_YTK8jsPEkTkcpFg"

	 return request("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+API)
	 .then(
	 	function(response){
	 		var obj=JSON.parse(response)
	 		

	 		return obj.results[0].geometry.location
	 	}
	 ).catch(function(err){
  		console.log(err, "request rejected")
  		}
  	 );
}

function getCurrentTemperatureAtPosition(position) {
	var API= "38ff65044045c0ef150e1a118de60f9c"

	return request("https://api.darksky.net/forecast/"+API+"/"+position.lat+","+position.lng)
	.then(
		function(response){
			var obj=JSON.parse(response)

			return obj.currently.temperature
		}
	)
}

function getCurrentTemperature(address) {
	
	return getAddressPosition(address)
	.then(function(data){
		return getCurrentTemperatureAtPosition(data)
	})

}

//without promise.all
/*function getDistanceFromIss(address) {
	return getIssPosition()
	.then(function(response){
		return getAddressPosition(address)
		.then(function(response2){
			return getDistance(response, response2)
		})
	})
}*/


//with promise.all
function getDistanceFromIss(address) {
	return Promise.all([getIssPosition(),getAddressPosition(address)])
	 .then(function(responses){
	 	 return getDistance(responses[0], responses[1])
	 })
}

/*getIssPosition().then(function (response){
	console.log(response)
});*/

/*getAddressPosition("1600+Amphitheatre+Parkway,+Mountain+View,+CA")
.then(function(response){
	console.log(response)

});
*/
/*getAddressPosition("1600+Amphitheatre+Parkway,+Mountain+View,+CA")
.then(function(response){
	getCurrentTemperatureAtPosition(response)
	.then(function(data){
		console.log(data)
	}
	);	
});
*/

/*getCurrentTemperature("1600+Amphitheatre+Parkway,+Mountain+View,+CA")
	.then(function(data){
		 console.log(data)
});*/
	

getDistanceFromIss("1600+Amphitheatre+Parkway,+Mountain+View,+CA")
	.then(function(data){

	console.log(data)
		
});

