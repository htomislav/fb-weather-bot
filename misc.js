// var myString = "weather abc , de, asfsf";
// var myString = "weather abc";
var myString ="assfrg"
var myRegexp = /weather\s([a-zA-Z]+)[,\s]*([a-zA-Z]*).*$/g;
var match = myRegexp.exec(myString);

console.log(match);
// console.log("0", match[0]);
// console.log("1", match[1]);
// console.log("2", match[2]);
