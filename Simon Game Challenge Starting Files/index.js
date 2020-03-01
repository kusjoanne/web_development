var sequence = [];
var userSequence = [];
var colors = ['red','green','blue','yellow'];

$(document).keypress(function(){
  generateSequence();
})

function generateSequence(){
  let newNumber= Math.floor(Math.random()*4);
  sequence.push(colors[newNumber]);
  $("#"+colors[newNumber]).fadeOut(100).fadeIn(100);
  console.log(sequence);
  getUserInput();
}

function getUserInput(sequenceLength){
  $(".btn").click(function(){
    $("#"+this.id).fadeOut(100).fadeIn(100);
    userSequence.push(this.id);
  });
 console.log(userSequence);
}
