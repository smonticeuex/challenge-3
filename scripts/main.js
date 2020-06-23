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

//Get the current time per user + AM PM format
function earthClock () {;
	var eClock = new Date(); 
	
	var hours = eClock.getHours();
	var minutes = eClock.getMinutes(); 
	var seconds = eClock.getSeconds();


    var amPM = (hours < 12) ? "AM" : "PM";

//Display the current time 
    document.getElementById('time').innerHTML = 
    hours + " : "+ minutes + " : " +seconds + "" + amPM;
	var t = setTimeout(earthClock, 500); 

}