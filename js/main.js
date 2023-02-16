//Today's Card Variables:
let search=document.getElementById('city-input'),
 today=document.getElementById('today'),
 todayDate=document.getElementById('today-date'),
 cityLocation=document.getElementById('location'),
 todayDegree=document.getElementById('today-degree'),
 todayIcon=document.getElementById('today-icon'),
 todayDescription=document.getElementById('today-description'),
 humidty=document.getElementById('humidty'),
 wind=document.getElementById('wind_mph'),
 compass=document.getElementById('wind_dir');


//Next Days Variables:
let nextDay=document.getElementsByClassName('nextDay'),
nextDayIcon=document.getElementsByClassName('nexDayIcon'),
maxDegree=document.getElementsByClassName('max-degree'),
minDegree=document.getElementsByClassName('min-degree'),
nextDayDescription=document.getElementsByClassName('nextDay-description'),
months=['January','February','March','April','May','June','July','August','September','October','November','December'],
days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
apiResponse,
responseData;

async function getWeatherData(currentCity="cairo")
{
 apiResponse=await fetch(`https://api.weatherapi.com/v1/forecast.json?key=147beabdb34741f3ba7152747211309&q=${currentCity}&days=3`)
 responseData=await apiResponse.json()
console.log(responseData);

displayToday()
displayNextDayWeather()
getCoordintes()
}

getWeatherData()

 function displayToday()
 {
    let date=new Date();
    today.innerHTML=days[date.getDay()];
    todayDate.innerHTML=`${date.getDate()} ${months[date.getMonth()]}`
    cityLocation.innerHTML=responseData.location.name;
    todayDegree.innerHTML=`${responseData.current.temp_c}<sup>o</sup>C`;
    todayIcon.setAttribute("src",`https:${responseData.current.condition.icon}`)
    todayDescription.innerHTML=responseData.current.condition.text;
    humidty.innerHTML=responseData.current.humidity;
     wind.innerHTML=responseData.current.wind_kph;
    compass.innerHTML =responseData.current.wind_dir;
 }

 

function displayNextDayWeather(){
    for( let i=0; i<nextDay.length;i++){
    nextDay[i].innerHTML= days[new Date(responseData.forecast.forecastday[i+1].date).getDay()];
   nextDayIcon[i].setAttribute('src',`https:${responseData.forecast.forecastday[i+1].day.condition.icon}`)
    maxDegree[i].innerHTML = `${responseData.forecast.forecastday[i+1].day.maxtemp_c}<sup>o</sup>C`;
    minDegree[i].innerHTML =`${responseData.forecast.forecastday[i+1].day.mintemp_c}<sup>o</sup>C`;
    nextDayDescription[i].innerHTML =responseData.forecast.forecastday[i+1].day.condition.text;
    }
  }
  
  search.addEventListener("keyup",function(){
    currentCity= search.value;
   console.log( currentCity);
  getWeatherData(currentCity);
  })
  

// Step 1: Get user coordinates
function getCoordintes() {
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	function success(pos) {
		var crd = pos.coords;
		var lat = crd.latitude.toString();
		var lng = crd.longitude.toString();
		var coordinates = [lat, lng];
		console.log(`Latitude: ${lat}, Longitude: ${lng}`);
		getCity(coordinates);
		return;

	}

	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	navigator.geolocation.getCurrentPosition(success, error, options);
}

// Step 2: Get city name
function getCity(coordinates) {
	var xhr = new XMLHttpRequest();
	var lat = coordinates[0];
	var lng = coordinates[1];

	// Paste your LocationIQ token below.
	xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.90b250623f2bca09c8501b1466692673&lat=" +lat + "&lon=" + lng + "&format=json", true);
	xhr.send();
	xhr.onreadystatechange = processRequest;
	xhr.addEventListener("readystatechange", processRequest, false);

	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.responseText);
			var city = response.address.city;
			console.log(city);
			return;
		}
	}
}

getCoordintes();
