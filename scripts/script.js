let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector("#search-input");
let historyEl = document.querySelector("#history");

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

      addCityAndCoOrdToLocalStorage(searchInputVal);
    }
  }
});

//This function stores the city and coordindates to local storage
function addCityAndCoOrdToLocalStorage(cityToAdd) {
  //console.log(getFuncName());

  //get coordinates from city
  let queryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityToAdd +
    "&limit=1" +
    "&apikey=" +
    OWMApiKey;
  //console.log(queryURL);

  fetch(queryURL)
    .then((response) => response.json())
    .then((cityReturn) => {
      // console.log(cityReturn[0]);

      let cityCoOrds = [];

      let cityCoOrdLat = cityReturn[0].lat;
      let cityCoOrdLon = cityReturn[0].lon;
      cityCoOrds.push(cityCoOrdLat);
      cityCoOrds.push(cityCoOrdLon);
      //  console.log("coOrdsArr:" , (JSON.stringify(cityCoOrds)));
      //store the city and coordinates
      localStorage.setItem(cityToAdd, JSON.stringify(cityCoOrds));

      //   let retrievedObject = localStorage.getItem(cityToAdd);
      //  console.log('retrievedObject', retrievedObject);

      //console.log('json retrievedObject: ', JSON.parse(retrievedObject));
    })
    .then((response) => {
      updateCityButtons();
    });
}

//This function updates the display
function updateCityButtons() {
  // console.log(getFuncName());

  for (let index = 0; index < localStorage.length; index++) {
    var city = localStorage.key(index);

    // var cityCoOrds = JSON.parse(localStorage.getItem(localStorage.key(index)));
    
    //add button for each city under historyEL

    console.log("city", city);
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
