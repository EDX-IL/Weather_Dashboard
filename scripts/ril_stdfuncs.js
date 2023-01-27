//standard functions to be used in other scripts

/* get the funtion name from within which the function is called. Useful for console.log */
function getFuncName() {
    return getFuncName.caller.name
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {

    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
}