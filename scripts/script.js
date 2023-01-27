let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector("#search-input");

let cityList = [""]

//variable to store the search input value ie. city
//let searchInputVal = "";
let searchInputVal = searchInputEl.placeholder;


//add listener for searchButtonEl
searchButtonEl.addEventListener("click", function(event){
   event.preventDefault();
  //  alert("searchbutton pressed");
  //  console.log(getFuncName());
   // console.log(event.target);
    //check if it was button pressed - may not be necessary
    if (event.target.matches("button")){
        
        //check if there was anything in the input field 
        //TODO - deal with the confusion the placeholder may cause user
        searchInputVal = searchInputEl.value.trim()
      //  console.log(searchInputVal);    
        if(searchInputVal !== ""){
        //TODO check if what was entered was in there before

            addCityToList (searchInputVal);



          }

        
 
 
    }
 
 })


 function addCityToList (cityToAdd){
    console.log(getFuncName());
    cityList.push(cityToAdd);

 }