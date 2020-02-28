var allButtons = document.querySelectorAll(".drum");

for(var i = 0; i<allButtons.length; i++){
  allButtons[i].addEventListener("click", function(){
    playSound(this.innerHTML);
    animate(this.innerHTML);
  });
}

document.addEventListener("keydown", function(){
  playSound(event.key);
  animate(event.key);
});

function playSound(key){
  var audio;
  switch(key){
    case 'w': audio = new Audio('sounds/crash.mp3');
    break;
    case 'a': audio = new Audio('sounds/kick-bass.mp3');
    break;
    case 's': audio = new Audio('sounds/snare.mp3');
    break;
    case 'd': audio = new Audio('sounds/tom-1.mp3');
    break;
    case 'j': audio = new Audio('sounds/tom-2.mp3');
    break;
    case 'k': audio = new Audio('sounds/tom-3.mp3');
    break;
    case 'l': audio = new Audio('sounds/tom-4.mp3');
    break;
    default:
    break;
  }
  audio.play();
}

function animate(key){
  document.querySelector("."+key).classList.toggle("pressed");
  setTimeout(function () {
    document.querySelector("."+key).classList.toggle("pressed");
  }, 100);
}
