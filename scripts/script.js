let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector("#search-input");

//variable to store the search input value ie. city
//let searchInputVal = "";
let searchInputVal = searchInputEl.placeholder;

//MyOpenWeatherMap ApiKey
let OWMApiKey = "f96f7ff289e95a70e78121ee26801ea4";

//OpenWeatherMap 5 day Forecast API
//"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";

//OpenWeatherMap Geocoding API
//"http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";

//function to clear local storage
function clearLocalStorage() {
  localStorage.clear();
}

//add listener for searchButtonEl
searchButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  //alert("search button pressed");
  //console.log(getFuncName());

  //check if it was button pressed - may not be necessary
  if (event.target.matches("button")) {
    //check if there was anything in the input field
    //TODO - deal with the confusion the placeholder may cause user
    searchInputVal = searchInputEl.value.trim();
    //console.log(searchInputVal);
    if (searchInputVal !== "") {
      //TODO check if city entered is actual city

      addCityToLocalStorage(searchInputVal);
    }
  }
});

//This function stores the passed parament to local storage
function addCityToLocalStorage(cityToAdd) {
  //console.log(getFuncName());

  console.log("1" + convertCityToCoOrdinates(cityToAdd));
  cityCoOrds = [1, 2];

  localStorage.setItem(cityToAdd, cityCoOrds);
  console.log(localStorage);
}

//This function updates the display
function updateDisplay() {
  console.log(getFuncName());
}

//This function converts the city name to coordinates using OpenWeatherMap GeoCodingAPI
function convertCityToCoOrdinates(cityName) {
  //console.log(getFuncName());
  //TODO return longitude and latitude
  let cityCoOrds = [0, 0];

  let queryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1" +
    "&apikey=" +
    OWMApiKey;
  console.log(queryURL);
  fetch(queryURL)
    .then((response) => response.json())
    .then((cityCoOrds) => {
      console.log(cityCoOrds);
      let cityCoOrdsLat = 0;
      let cityCoOrdsLon = 0;
      return [cityCoOrdsLat, cityCoOrdsLon];
    });
}

//This function takes longitude and latitude and returns weather
function getWeatherFromCoOrdinates(lat, lon) {
  console.log(getFuncName());

  //Use Glasgow to test
  lat = 55.8609825;
  lon = -4.2488787;

  console.log(lat, lon);

  let queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    OWMApiKey;
  console.log(queryURL);

  fetch(queryURL)
    .then((response) => response.json())
    .then((weather) => {
      console.log(weather);
    });
}
