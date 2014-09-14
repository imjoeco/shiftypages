// This file handles drag events for moving elements with
// the "draggable" class. Use in ShiftyPages is currently limited
// to moving the copyright notice around photos.

window.addEventListener("load", function draggable(e){
  window.removeEventListener("load", draggable, false);
  var draggables = document.getElementsByClassName("draggable");

  for(i=0;i<draggables.length;i++){
    draggables[i].addEventListener('mousedown', startDrag, false);
    draggables[i].addEventListener('mouseup', stopDrag, false);
  }
}, false);

function startDrag(e){
  e.preventDefault();
  var target = document.getElementById(e.target.id), 
    mouseX = e.clientX,
    mouseY = e.clientY,
    offsetTop = parseInt(target.style.top),
    offsetLeft = parseInt(target.style.left),
    mouseOffsetX = mouseX - offsetLeft,
    mouseOffsetY = mouseY - offsetTop;

  document.onmousemove = function(e){ 
    mouseX = e.clientX;
    mouseY = e.clientY;
    offsetLeft = mouseX - mouseOffsetX;
    offsetTop = mouseY - mouseOffsetY;

    target.style.left = offsetLeft + 'px';
    target.style.top = offsetTop + 'px';
  }
}

function stopDrag(e){
  e.preventDefault();
  var target = document.getElementById(e.target.id),
    positionLeft = parseInt(target.style.left),
    positionTop = parseInt(target.style.top);
    offsetLeft = round(positionLeft/target.parentNode.offsetWidth),
    offsetTop = round(positionTop/target.parentNode.offsetHeight );

  document.onmousemove = function(){}
  document.getElementById("photo_copyright_top_offset").value = offsetTop;
  document.getElementById("photo_copyright_left_offset").value = offsetLeft;
}

function round(number){
  return Math.round(number * 100000) /100000;
}
