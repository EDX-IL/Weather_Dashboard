let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector("#search-input");
let historyEl = document.querySelector("#history");
let clearButtonEl = document.querySelector("#clear-button");
let forecastEl = document.querySelector("#forecast");
let todayEl = document.querySelector("#today");

//This sets the time that the displayed forecast for each day is taken from
//string from 3,6,9,12,15,18,21,24 from the 24 hour clock
let dailyForecastHour = "12";
//This would be used if the user was to input the time of day for the forecast
let dailyForecastHourArr = ["3", "6", "9", "12", "15", "18", "21", "24"];

//array to store forecast for 5 days (0-4)
let dayForecastArr = [];

//MyOpenWeatherMap ApiKey
let OWMApiKey = "f96f7ff289e95a70e78121ee26801ea4";

//on opening up the page - load local storage
window.onload = function () {
  updateCityButtons();
  hideClearCitiesButton();
  if (localStorage.length > 0) {
    showClearCitiesButton();
  }
};

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
  clearForecast();
  hideClearCitiesButton();
});

//add event listener for searchButtonEl
searchButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  //variable to store the search input value ie. city
  let searchInputVal = "";
  //check if it was button pressed
  if (event.target.matches("button")) {
    //check if there was anything in the input field
    searchInputVal = searchInputEl.value.trim();
    //console.log(searchInputVal);
    if (searchInputVal !== "") {
      //TODO check if city entered is actual city (not necessary for api)
      addCityAndCoOrdToLocalStorage(searchInputVal);
      showClearCitiesButton();
      clearTheSearchInputField();
    }
  }
});

//FUNCTIONS

//function to clear local storage
function clearLocalStorage() {
  localStorage.clear();
}

//function to clear the forecast (if there are no cities)
function clearForecast() {
  forecastEl.innerHTML = "";
  historyEl.innerHTML = "";
  todayEl.innerHTML = "";
}

//function to clear the search input field (placeholder will display)
function clearTheSearchInputField() {
  searchInputEl.value = "";
}

function hideClearCitiesButton() {
  document.getElementById("clear-button").style.display = "none";
}

function showClearCitiesButton() {
  document.getElementById("clear-button").style.display = "";
}

//This function updates the city buttons displayed from local storage
function updateCityButtons() {
  //clear the buttons
  historyEl.innerHTML = "";
  //create buttons from local storage
  for (let index = 0; index < localStorage.length; index++) {
    var city = localStorage.key(index);
    //add button for each city under historyEL-set unique ID attribute
    let newButtonEl = document.createElement("button", (id = "TAG"));
    newButtonEl.textContent = city;
    newButtonEl.setAttribute("id", "button-" + city);
    historyEl.append(newButtonEl);
  }
}

//This function stores the city and coordinates to local storage
function addCityAndCoOrdToLocalStorage(cityToAdd) {
  // URL to get coordinates from city name
  let openWMGeoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityToAdd}&limit=1&apikey=${OWMApiKey}`;

  fetch(openWMGeoURL)
    .then((response) => response.json())
    .then((cityReturn) => {
      let cityCoOrds = [];
      let cityCoOrdLat = cityReturn[0].lat;
      let cityCoOrdLon = cityReturn[0].lon;
      cityCoOrds.push(cityCoOrdLat);
      cityCoOrds.push(cityCoOrdLon);
      localStorage.setItem(cityToAdd, JSON.stringify(cityCoOrds));
    })
    .then((response) => {
      updateCityButtons();
    });
}

function displayForecastForCity(cityClicked) {
  //clear today/city name display
  todayEl.innerHTML = "";
  // get latitude and longitude for city clicked
  let cityCoOrds = JSON.parse(localStorage.getItem(cityClicked));
  let cityLat = cityCoOrds[0];
  let cityLon = cityCoOrds[1];
  getWeatherFromLatAndLon(cityLat, cityLon);
  getForecastFromLatAndLon(cityLat, cityLon);
}

//function to get 5 day Forecast from latitude and longitude
function getForecastFromLatAndLon(lat, lon) {
  //URL to Get 5 day forecast from coordinates
  let openWMForecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWMApiKey}`;

  fetch(openWMForecastURL)
    .then((response) => response.json())
    .then((forecastReturn) => {
      display5DayForecast(forecastReturn);
    });
}

//function to get today's weather from latitude and longitude
function getWeatherFromLatAndLon(lat, lon) {
  //URL to Get today's forecast from coordinates
  let openWMWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWMApiKey}`;

  fetch(openWMWeatherURL)
    .then((response) => response.json())
    .then((weatherReturn) => {
      displayTodayForecast(weatherReturn);
    });
}
//function that takes the returned forecast from OWM and displays the city as they return it
function displayTodayForecast(returnedWeather) {
  let cityToDisplay = returnedWeather.name;
  let todayWeatherDate = moment.unix(returnedWeather.dt).format("DD MMM YYYY");
  let todayWeatherTemp = (returnedWeather.main.temp - 273.15).toFixed(2);
  let todayWeatherWind = returnedWeather.wind.speed;
  let todayWeatherHumidity = returnedWeather.main.humidity;
  let todayWeatherIcon = returnedWeather.weather[0].icon;
  let backgroundImageURL = `http://openweathermap.org/img/wn/${todayWeatherIcon}@2x.png`;
  let newDiv = document.createElement("div");
  let newP = document.createElement("p");

  newDiv.id = "city-today";
  newDiv.className = "card";
  newDiv.style = "width: 100%";
  newDiv.innerHTML = `<h1 id="cityToDisplay">${cityToDisplay}</h1>`;
  newDiv.style.backgroundImage = `url(${backgroundImageURL})`;

  newP.className = "today-card-text";
  newP.innerHTML = `<div> <h4> ${todayWeatherDate} </h4> </div> <div>Temp: ${todayWeatherTemp} ℃</div> <div>Wind: ${todayWeatherWind} KPH</div> <div>Humidity: ${todayWeatherHumidity} %</div>`;

  newDiv.append(newP);
  todayEl.append(newDiv);
}

//function to display 5Day Forecast from OWM
function display5DayForecast(returnedForecast) {
  //TODO - look into icons vs local time
  // dayIndex is used access dayForecastArr(ay) for 5 (0-4)  days.
  let dayIndex = 0;
  //clear 5 day forecast
  forecastEl.innerHTML = "";

  //indexOffset is used to get midday from the returnedForecast (which is dependent on the time of day the request is made)
  let indexOffset = 0;
  forecastHour = moment
    .unix(returnedForecast.list[indexOffset].dt)
    .format("HH");

  while (forecastHour != dailyForecastHour && indexOffset < 41) {
    indexOffset++;
    forecastHour = moment
      .unix(returnedForecast.list[indexOffset].dt)
      .format("kk");
  }

  for (
    let index = indexOffset;
    index < returnedForecast.list.length;
    index = index + 8
  ) {
    dayForecastArr[dayIndex] = returnedForecast.list[index];

    let forecastDate = moment
      .unix(returnedForecast.list[index].dt)
      .format("DD MMM YYYY");

    //values to be displayed for each day
    let forecastTemp = (dayForecastArr[dayIndex].main.temp - 273.15).toFixed(2);
    let forecastWind = dayForecastArr[dayIndex].wind.speed;
    let forecastHumidity = dayForecastArr[dayIndex].main.humidity;
    let forecastIcon = dayForecastArr[dayIndex].weather[0].icon;

    let newDiv = document.createElement("div");
    let newImg = document.createElement("img");
    let newDiv2 = document.createElement("div");
    let newP = document.createElement("p");

    newDiv.id = "day" + (dayIndex + 1);
    newDiv.className = "card";
    newDiv.style = "width: 20%";
    newDiv.innerHTML = `<h4 class="date-header">${forecastDate} </h4>`;

    newImg.className = "card-img-top";
    newImg.src = `http://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
    newImg.alt = "Weather Icon";

    newDiv2.className = "card-body";

    newP.className = "card-text";
    newP.innerHTML = `<div>Temp: ${forecastTemp} ℃</div> <div>Wind: ${forecastWind} KPH</div> <div>Humidity: ${forecastHumidity} %</div>`;

    newDiv.append(newImg);
    newDiv2.append(newP);
    newDiv.append(newDiv2);

    forecastEl.append(newDiv);

    dayIndex++;
  }
}
