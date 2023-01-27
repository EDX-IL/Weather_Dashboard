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
  localStorage.setItem(cityToAdd, cityToAdd);
  console.log(localStorage);
}

//This function updates the display
function updateDisplay() {
  console.log(getFuncName());
}
