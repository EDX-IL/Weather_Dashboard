let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector("#search-input");
let historyEl = document.querySelector("#history");
let clearButtonEl = document.querySelector("#clear-button");

//TODO handle empty local storage

//variable to store the search input value ie. city
//let searchInputVal = "";
let searchInputVal = searchInputEl.placeholder;

//MyOpenWeatherMap ApiKey
let OWMApiKey = "f96f7ff289e95a70e78121ee26801ea4";

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

//function to clear local storage
function clearLocalStorage() {
  // console.log(getFuncName());
  localStorage.clear();
}

function displayForecastForCity(cityClicked) {
  // console.log(getFuncName());
  // console.log(cityClicked);

  // get latitude and longitude for city clicked
  let cityCoOrds = JSON.parse(localStorage.getItem(cityClicked));

  // console.log(cityCoOrds);
  let cityLat = cityCoOrds[0];
  let cityLon = cityCoOrds[1];

  // console.log("cityLat:", cityLat);
  // console.log("cityLon:", cityLon);

  getForecastFromLatAndLon(cityLat, cityLon);
}

//function to getForecast from latitude and longitude
function getForecastFromLatAndLon(lat, lon) {
  // console.log(getFuncName());
  // console.log(lat);
  // console.log(lon);

  //url with APIkey
  let openWMForecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWMApiKey}`;

  // console.log(openWMForecastURL);

  fetch(openWMForecastURL)
    .then((response) => response.json())
    .then((forecastReturn) => {
      //  console.log(forecastReturn);

      displayCityFromForecast(forecastReturn);
      display5DayForecast(forecastReturn);
    });
}

//function that takes the returned forecast from OWM and displays the city as they return it
function displayCityFromForecast(returnedForecast) {
  // console.log(getFuncName());
  let cityToDisplay = returnedForecast.city.name;
  console.log(cityToDisplay);
}

//function to display 5Day Forecast from OWM
function display5DayForecast(returnedForecast) {
  //  console.log(getFuncName());
 // console.log(returnedForecast);

  for (let index = 4; index < returnedForecast.list.length; index = index + 8) {
    const element = returnedForecast[index];

    let forecastDate = moment
      .unix(returnedForecast.list[index].dt)
      .format("DD MMM YYYY hh:mm a");

    console.log(forecastDate);
  }
}
