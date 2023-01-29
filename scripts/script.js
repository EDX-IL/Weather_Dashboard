let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector("#search-input");
let historyEl = document.querySelector("#history");
let clearButtonEl = document.querySelector("#clear-button");
let forecastEl = document.querySelector("#forecast");
let todayEl = document.querySelector("#today");

//array to store forecast for 5 days (0-4)
let dayForecastArr = [];

//MyOpenWeatherMap ApiKey
let OWMApiKey = "f96f7ff289e95a70e78121ee26801ea4";

//on opening up the page - load local storage
document.onload = function () {
  updateCityButtons();
};

// EVENT LISTENERS

// add event lister for history element i.e the city buttons
historyEl.addEventListener("click", function (event) {
  //check a button has been clicked
  if (event.target.matches("button")) {
    let cityClicked = event.target.textContent;
    displayForecastForCity(cityClicked);
    //  event.target.textContent = cityToDisplay;
  }
});

//add event listener for clear-button
clearButtonEl.addEventListener("click", function () {
  clearLocalStorage();
  updateCityButtons();
  clearForecast();
  //hide clear cities button
  document.getElementById("clear-button").style.display = "none";
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
      //display the clear cities button
      document.getElementById("clear-button").style.display = "";
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

//This function updates the city buttons displayed from local storage
function updateCityButtons() {
  //clear the buttons
  historyEl.innerHTML = "";
  //create buttons from localstorage
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
  getForecastFromLatAndLon(cityLat, cityLon);
}

//function to getForecast from latitude and longitude
function getForecastFromLatAndLon(lat, lon) {
  //URL to Get forecast from coordinates
  let openWMForecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWMApiKey}`;

  fetch(openWMForecastURL)
    .then((response) => response.json())
    .then((forecastReturn) => {
      displayTodayForecast(forecastReturn);
      display5DayForecast(forecastReturn);
    });
}

//function that takes the returned forecast from OWM and displays the city as they return it
function displayTodayForecast(returnedForecast) {
  let cityToDisplay = returnedForecast.city.name;
  let newDiv = document.createElement("div");
  newDiv.innerHTML = `<h1 id="cityToDisplay">${cityToDisplay}</h1>`;
  todayEl.append(newDiv);
  //TODO - find out from Dane if we need to display Today separately from the 5 forecast cards as there is only 5 days of forecast free
}

//function to display 5Day Forecast from OWM
function display5DayForecast(returnedForecast) {
  // dayIndex is used access dayForecastArr(ay) for 5 (0-4)  days.
  let dayIndex = 0;
  //clear 5 day forecast
  forecastEl.innerHTML = "";


  //indexOffset is used to get midday from the returnedForecast (which is dependent on the time of day the request is made)
  let indexOffset = 0
  do {
      forecastHour=moment
        .unix(returnedForecast.list[indexOffset].dt)
        .format("hh");
      console.log(forecastHour);
      console.log (indexOffset);
    indexOffset++;
    
    } while ( (forecastHour !="12") && (indexOffset < 41));



    console.log (indexOffset);
  

  for (
    let index = indexOffset;
    index < returnedForecast.list.length;
    index = index + 8
  ) {
    // const element = returnedForecast[index];

    dayForecastArr[dayIndex] = returnedForecast.list[index];

    let forecastDate = moment
      .unix(returnedForecast.list[index].dt)
      .format("DD MMM YYYY hh:mm ");

    let forecastTime = moment
      .unix(returnedForecast.list[index].dt)
      .format("hh:mm a ");

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
    //newImg.src = "./images/default.png";
    newImg.src = `http://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
    newImg.alt = "Open Weather Map Logo";

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
