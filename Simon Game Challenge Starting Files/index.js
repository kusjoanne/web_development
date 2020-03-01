var sequence = [];
var userSequence = [];
var colors = ['red','green','blue','yellow'];
var level = 0;

$(document).keypress(function(){
  generateSequence();
});

function generateSequence(){
  let newNumber= Math.floor(Math.random()*4);
  let newColor= colors[newNumber];
  sequence.push(newColor);
  $("#"+newColor).fadeOut(100).fadeIn(100);
  playSound(newColor);
  console.log("sequence " + sequence);
  level++;
  $("h1").text("Level " + level);
  userSequence = [];
}

$(".btn").click(function(){
  var userColor = $(this).attr("id");
  userSequence.push(userColor);
  animatePress(userColor);
  playSound(userColor);
  console.log("user sequence " + userSequence);
  checkAnswer(userSequence.length-1);
});

function checkAnswer(lastItem){
  if(userSequence[lastItem] == sequence[lastItem]){
    if(userSequence.length === sequence.length){
      setTimeout(function () {
        generateSequence();
      }, 1000);
    }
  }
  else{
    $("h1").text("Game Over, Press Any Key to Restart ");
    $("body").addClass("game-over");
    setTimeout(function(){
      $("body").removeClass("game-over");
    },200);
    startOver();
  }
}

function playSound(color){
  var audio = new Audio("sounds/"+color+".mp3");
  audio.play();
}

function animatePress(color){
  $("#"+color).addClass("pressed");
  setTimeout(function(){
    $("#"+color).removeClass("pressed");
  });
}

function startOver(){
  level = 0;
  sequence = [];
  userSequence = [];
}
