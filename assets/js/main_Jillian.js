/*
	Photon by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1141px',  '1680px' ],
			large:    [ '981px',   '1140px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '321px',   '480px'  ],
			xxsmall:  [ null,      '320px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

})(jQuery);



/*
Jillian:
	Sound #1: https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=ed2c35e6f733635a8b7334f2bb152045
	Button: #1: ed2c35e6f733635a8b7334f2bb152045
	Light #2: https://us.wio.seeed.io/v1/node/GroveLuminanceA0/luminance?access_token=afa330caae30386e81322f1ce7fce631
Erin:
	Sound #3: https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=db214dbdf1fdacbcc555f33c408c2707
	Button: #3: db214dbdf1fdacbcc555f33c408c2707
	Light #4: https://us.wio.seeed.io/v1/node/GroveLuminanceA0/luminance?access_token=67f7830f6026b4e04cad102472b669a1
Rob:
	Sound #5: https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=81574af7aeae678e43c58213288f4aec
	Button: #5: 81574af7aeae678e43c58213288f4aec
	Light #6: https://us.wio.seeed.io/v1/node/GroveLuminanceA0/luminance?access_token=138e0a478f276ea4b642b6642315782e
Kaitlyn:
	Sound #7: https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=7d636d3d891b2ae545c6da21831d719b
	Button: #7: 7d636d3d891b2ae545c6da21831d719b
	Light #8: https://us.wio.seeed.io/v1/node/GroveLuminanceA0/luminance?access_token=26b659475677eef763ec35fe4b3e41f4
*/


//start/stop button setup
var continueCollectData = true;
var locationAsynch;
var myVar;

function myTimer() {
    asychCheck = collectData(locationAsynch);
			if(continueCollectData == false){
				console.log("false!");
			}
	};

function startDataCollection() {

	continueCollectData = true;
	var locationAsynch = submitLocationData();
		/*var intervalId = window.setInterval(function(){
			var asychCheck = collectData(locationAsynch);
			if(continueCollectData == false){
				console.log("false!");
				return;
				window.clearInterval(intervalId);
			}
		}, 1000);*/

	myVar = setInterval(myTimer, 1000);
}


function stopCollection(){
	continueCollectData = false;
	clearInterval(myVar);
}


//building data
var locationData = {
			buildingLocation: "", 
			studySpot: "", 
			dataCollector: "",
		};

		function submitLocationData()
        {
            locationData.buildingLocation = document.getElementById("demo-building").value;
            locationData.studySpot = document.getElementById("form-studySpot").value;
            locationData.dataCollector = document.getElementById("form-name").value;
            return(locationData);
        }




		//data api collection
		
		//#1
		var tableString = "";
		var ws = new WebSocket('wss://us.wio.seeed.io/v1/node/event');
		
		//button collection
		//ROWS: date | time | Building | Study Spot | Collector
		ws.onopen = function() {
    		ws.send("ed2c35e6f733635a8b7334f2bb152045");
		};
		ws.onmessage = function (evt) {
			var d = new Date();
			var date = d.toLocaleString();
    		//alert(evt.data);
    		//console.log(date);
    		if(evt.data == "\{\"error\"\: \"node is offline\"\}"){
    			alert("Node is offline! Plug it in and try again.")
    		}
    		console.log(evt.data);
    		tableString = tableString + date + "<br>";
    		document.getElementById("ButtonData").innerHTML = tableString;
		};


		var xhttp = new XMLHttpRequest();
		


		//sound and light collection
		//ROWS: sound level | light level | date | time | Building | Study Spot | Collector
		var soundTable = "";


	function collectData(asynchCheck){
			//window.setInterval(function(){
			var soundLvl = "";
			xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
			       // Typical action to be performed when the document is ready:
			        var response = xhttp.responseText;
			        //console.log("ok"+response);
			        var sound_length = response.length - 1;
			        for (var i = 16; i < sound_length; i++) { 
	    				soundLvl = soundLvl + response[i];
					}

					var d = new Date();
					var date = d.toLocaleString();
					console.log("LightRow: " + collectLightData());
					soundTable = soundTable + soundLvl + ", " + date + ", " + locationData.buildingLocation + ", " + locationData.studySpot + ", " + locationData.dataCollector + "<br>";
			        document.getElementById("SoundData").innerHTML = soundTable;
			    }
			};
			
			xhttp.open("GET", "https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=ed2c35e6f733635a8b7334f2bb152045", true);
			xhttp.send();
			//}, 1000);
		//console.log("Sound!");
		//collectLightData(xhttp.onreadystatechange);
		return;
	};


	var lightTable = "";
	function collectLightData(){
			//window.setInterval(function(){
			xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
			       // Typical action to be performed when the document is ready:
			        var response = xhttp.responseText;
			        //console.log("ok"+response);
			        var light_length = response.length - 1;
			        var lightLvl = "";
			        for (var i = 8; i < light_length; i++) { 
	    				lightLvl = lightLvl + response[i];
					}

					var d = new Date();
					var date = d.toLocaleString();
					lightTable = lightTable + lightLvl + ", " + date + ", " + locationData.buildingLocation + ", " + locationData.studySpot + ", " + locationData.dataCollector + "<br>";
			        document.getElementById("LightData").innerHTML = lightTable;
			    }
			};
			
			xhttp.open("GET", "https://us.wio.seeed.io/v1/node/GroveLuminanceA0/luminance?access_token=afa330caae30386e81322f1ce7fce631", true);
			xhttp.send();
			//}, 1000);
		//console.log("Light! " + lightTable);
		return (lightTable);
	};


function download_csv(){
	download_csv_button();
	download_csv_sound();
	download_csv_light();
};

function download_csv_button() {
    /*var csv = 'Name,Title\n';
    data.forEach(function(row) {
            csv += row.join(',');
            csv += "\n";
    });*/

    var d = new Date();
    var date = d.toLocaleString();
    var docName = "button " + date + " tisch_jill";

    //console.log(docName);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(tableString);
    hiddenElement.target = '_blank';
    hiddenElement.download = docName + '.csv';
    //document.getElementById('container').appendChild(hiddenElement);
    hiddenElement.click();
};


function download_csv_sound() {
    /*var csv = 'Name,Title\n';
    data.forEach(function(row) {
            csv += row.join(',');
            csv += "\n";
    });*/

    var d = new Date();
    var date = d.toLocaleString();
    var docName = "sound " + date + " tisch_jill";

    //console.log(docName);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(soundTable);
    hiddenElement.target = '_blank';
    hiddenElement.download = docName + '.csv';
    //document.getElementById('container').appendChild(hiddenElement);
    hiddenElement.click();
}

function download_csv_light() {
    /*var csv = 'Name,Title\n';
    data.forEach(function(row) {
            csv += row.join(',');
            csv += "\n";
    });*/

    var d = new Date();
    var date = d.toLocaleString();
    var docName = "light " + date + " tisch_jill";

    //console.log(docName);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(lightTable);
    hiddenElement.target = '_blank';
    hiddenElement.download = docName + '.csv';
    //document.getElementById('container').appendChild(hiddenElement);
    hiddenElement.click();
}


