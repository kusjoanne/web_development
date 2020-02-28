var images = document.querySelectorAll("img");

//this would work if we didn't have to update the header
//allows us to add more players easily
// for(let i = 0; i < images.length; i++){
//   let num = Math.floor((Math.random() * 6) + 1);
//   console.log(diceNum1);
//   images[i].setAttribute("src", "images/dice"+num+".png");
// }

var diceNum1 = Math.floor((Math.random() * 6) + 1);
var diceNum2 = Math.floor((Math.random() * 6) + 1);
images[0].setAttribute("src", "images/dice"+diceNum1+".png");
images[1].setAttribute("src", "images/dice"+diceNum2+".png");

if(diceNum1 > diceNum2){
  document.querySelector("h1").textContent = "Player 1 Wins!";}
else if(diceNum2 > diceNum1){
  document.querySelector("h1").textContent = "Player 2 Wins!";}
else{
  document.querySelector("h1").textContent = "Roll Again";}
