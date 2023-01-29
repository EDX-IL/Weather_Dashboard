let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector("#search-input");
let historyEl = document.querySelector("#history");
let clearButtonEl = document.querySelector("#clear-button");
let forecastEl = document.querySelector("#forecast");
let todayEl = document.querySelector("#today");

//array to store forecast for 5 days (0-4)
let dayForecastArr = [];

//TODO handle empty local storage

//variable to store the search input value ie. city
//let searchInputVal = "";
let searchInputVal = searchInputEl.placeholder;

//MyOpenWeatherMap ApiKey
let OWMApiKey = "f96f7ff289e95a70e78121ee26801ea4";

//on opening up the page - load local storage
document.onload =function() {
  
  document.getElementById("clear-button").style.display = 'none';

  updateCityButtons();

}
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
  //hide clear cities button
  document.getElementById("clear-button").style.display = 'none';

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

  //display clear cities button
  document.getElementById("clear-button").style.display = '';
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
  todayEl.innerHTML="";
}

//This function updates the display
function updateCityButtons() {
  historyEl.innerHTML = "";

  for (let index = 0; index < localStorage.length; index++) {
    var city = localStorage.key(index);

    //add button for each city under historyEL-set unique ID attribute
    let newButtonEl = document.createElement("button", (id = "TAG"));
    newButtonEl.textContent = city;
    newButtonEl.setAttribute("id", "button-" + city);
    historyEl.append(newButtonEl);
  }
}

//This function stores the city and coordindates to local storage
function addCityAndCoOrdToLocalStorage(cityToAdd) {
  // URL to get coordinates from city
  let openWMGeoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityToAdd}&limit=1&apikey=${OWMApiKey}`;

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
  //console.log(cityToDisplay);

  let newDiv = document.createElement("div");
  newDiv.innerHTML = `<h1 id="cityToDisplay">${cityToDisplay}</h1>`;
  todayEl.append(newDiv);

  //TODO - find out if we need to do Today separately from the cards as there is only 5 days of forecast free
}

//function to display 5Day Forecast from OWM
function display5DayForecast(returnedForecast) {
  //  console.log(getFuncName());
  console.log(returnedForecast);
  let dayIndex = 0;

  //clear 5 day forecast
  forecastEl.innerHTML = "";

  //TODO find where midday is and use that to modify index offset
  //indexOffset is used to get midday from the returnedForecast (which is dependent on the time of day the request is made)
  let indexOffset = 3;

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

    console.log(dayForecastArr[dayIndex]);

    //  console.log ('day', dayIndex);
    let forecastTemp = (dayForecastArr[dayIndex].main.temp - 273.15).toFixed(2);
    let forecastWind = dayForecastArr[dayIndex].wind.speed;
    let forecastHumidity = dayForecastArr[dayIndex].main.humidity;
    let forecastIcon = dayForecastArr[dayIndex].weather[0].icon;

    //TODO  get the data from dayForecastArr and display

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
