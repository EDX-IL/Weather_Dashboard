let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector("#search-input");

//variable to store the search input value ie. city
//let searchInputVal = "";
let searchInputVal = searchInputEl.placeholder;

//function to clear local storage
function clearLocalStorage() {
  localStorage.clear();
}

//add listener for searchButtonEl
searchButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  //  alert("search button pressed");
  //  console.log(getFuncName());

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
  //  console.log(getFuncName());

let cityCoOrds = convertCityToCoOrdinates (citytoAdd);


  localStorage.setItem(cityToAdd, cityCoOrds);
  console.log(localStorage);
}

//This function updates the display
function updateDisplay() {
  console.log(getFuncName());
}


//This function converts the city name to coordinates using OpenWeatherMap GeoCodingAPI
function convertCityToCoOrdinates(cityName){
    console.log(getFuncName());
    //TODO implement call to API - using cityName temporarily
    return cityName;

}