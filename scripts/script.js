let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector("#search-input");
let historyEl = document.querySelector("#history");
let clearButtonEl = document.querySelector("#clear-button");

//variable to store the search input value ie. city
//let searchInputVal = "";
let searchInputVal = searchInputEl.placeholder;

//MyOpenWeatherMap ApiKey
let OWMApiKey = "f96f7ff289e95a70e78121ee26801ea4";

//OpenWeatherMap 5 day Forecast API
//"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";

//OpenWeatherMap Geocoding API
//"http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";

//on opening up the page - load local storage
document.onload = updateCityButtons();

// EVENT LISTENERS

// add event lister for history element i.e the city buttons
historyEl.addEventListener("click", function (event) {
  //check a button has been clicked
  if (event.target.matches("button")) {
    let cityClicked = event.target.textContent;
    displayForecastForCity(cityClicked);
  }
});

//add event listener for clear-button
clearButtonEl.addEventListener("click", function () {
  clearLocalStorage();
  updateCityButtons();
});

//add event listener for searchButtonEl
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

      addCityAndCoOrdToLocalStorage(searchInputVal);
    }
  }
});

//This function stores the city and coordindates to local storage
function addCityAndCoOrdToLocalStorage(cityToAdd) {
  //console.log(getFuncName());

  //get coordinates from city
  let openWMGeoURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityToAdd +
    "&limit=1" +
    "&apikey=" +
    OWMApiKey;
  //console.log(openWMGeoURL);

  fetch(openWMGeoURL)
    .then((response) => response.json())
    .then((cityReturn) => {
      // console.log(cityReturn[0]);

      let cityCoOrds = [];

      let cityCoOrdLat = cityReturn[0].lat;
      let cityCoOrdLon = cityReturn[0].lon;
      cityCoOrds.push(cityCoOrdLat);
      cityCoOrds.push(cityCoOrdLon);
      //  console.log("coOrdsArr:" , (JSON.stringify(cityCoOrds)));
      localStorage.setItem(cityToAdd, JSON.stringify(cityCoOrds));
    })
    .then((response) => {
      updateCityButtons();
    });
}

//This function updates the display
function updateCityButtons() {
  // console.log(getFuncName());

  //clear button
  historyEl.innerHTML = "";

  for (let index = 0; index < localStorage.length; index++) {
    var city = localStorage.key(index);

    //add button for each city under historyEL-set unique ID attribute
    let newButtonEl = document.createElement("button", (id = "TAG"));
    newButtonEl.textContent = city;
    newButtonEl.setAttribute("id", "button-" + city);
    historyEl.append(newButtonEl);

    //  console.log("city", city);
  }
}

// //This function converts the city name to coordinates using OpenWeatherMap GeoCodingAPI
// function convertCityToCoOrdinates(cityName) {
//   console.log(getFuncName());
//   //TODO return longitude and latitude
//   let cityCoOrds = [0, 0];

//   let queryURL =
//     "http://api.openweathermap.org/geo/1.0/direct?q=" +
//     cityName +
//     "&limit=1" +
//     "&apikey=" +
//     OWMApiKey;
//   console.log(queryURL);
//   fetch(queryURL)
//     .then((response) => response.json())
//     .then((cityCoOrds) => {
//       console.log("citycoords:"+ cityCoOrds );
//       let cityCoOrdsLat = 100;
//       let cityCoOrdsLon = 200;
//       return [cityCoOrdsLat, cityCoOrdsLon];
//     });
// }

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

//function to display local storage as button
function displayLocalStorageAsButtons() {
  //  console.log(getFuncName());

  for (let index = 0; index < localStorage.length; index++) {
    //  console.log(localStorage);
    let city = localStorage.key(index);
    console.log(city);

    //TODO Add Buttons
  }
}

//function to clear local storage
function clearLocalStorage() {
  // console.log(getFuncName());
  localStorage.clear();
}

function displayForecastForCity(cityClicked) {
  // console.log(getFuncName());
  // console.log(cityClicked);

  // get latitude and longitude for cityclicked
  let cityCoOrds = JSON.parse(localStorage.getItem(cityClicked));

  // console.log(cityCoOrds);
  let cityLat = cityCoOrds[0];
  let cityLon = cityCoOrds[1];

  console.log("cityLat:", cityLat);
  console.log("cityLon:", cityLon);

  getForecastFromLatAndLon(cityLat, cityLon);
}

function getForecastFromLatAndLon(lat, lon) {
  console.log(getFuncName());

  //"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
  
    console.log(lat);
    console.log(lon);

    //get forecast from lat and lon
    let openWMForecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWMApiKey}`
 
    
  //  OWMApiKey;
  console.log(openWMForecastURL);

  fetch(openWMForecastURL)
    .then((response) => response.json())
    .then((forecastReturn) => {
       console.log(forecastReturn);

    
    });


}
