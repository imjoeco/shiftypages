// This file handles slide events for moving elements with
// the "handle" class. Use in ShiftyPages is currently limited
// to opacity and size sliders for photo copyrights.

var handleWidth = 24;

window.addEventListener("load", function posts(e){
  window.removeEventListener("load", posts, false);
  var handles = document.getElementsByClassName("handle"),
    sliderWidth;
  
  //check and add event listeners to handles if present
  if(handles.length > 0){
    for(i=0;i<handles.length;i++){
      handles[i].id = "handle-"+i;
      if(handles[i].style.left.length == 0){
        checkTarget(handles[i]);
      }
      handles[i].addEventListener('mousedown', slide, false);
    }

    document.getElementById("notice-settings").style.display = "none";
  }
}, false);

function checkTarget(handle){
  var sliderWidth = parseFloat(handle.parentNode.offsetWidth)-handleWidth,
    slideTargetId = handle.parentNode.getAttribute("data-slider-target"),
    copyNotice = document.getElementById("copy-notice"),
    slideTarget, activeSegment, offsetLeft;

  if(slideTargetId){
    slideTarget = document.getElementById(slideTargetId);
    activeSegment = handle.parentNode.getElementsByClassName("active-segment")[0];
    offsetLeft = slideTarget.value * sliderWidth;

    if(activeSegment) activeSegment.style.width = offsetLeft + "px";
    handle.style.left = offsetLeft + "px";

    //specific to app
    if(slideTargetId == "photo_copyright_opacity"){
      copyNotice.style.opacity = slideTarget.value;
    }

    if(slideTargetId == "photo_copyright_size"){
      copyNotice.style.fontSize = Math.round(slideTarget.value * copyNotice.parentNode.offsetHeight/4) + "px";
    }
  }
}

function slide(e){
  e.preventDefault();
  var handle = document.getElementById(e.target.id), 
    mouseX = e.clientX,
    offsetLeft = parseInt(handle.style.left),
    mouseOffsetX = mouseX - offsetLeft,
    activeSegment = handle.parentNode.getElementsByClassName("active-segment")[0];
    sliderWidth = handle.parentNode.offsetWidth - handleWidth;

  // these are specific to this app
  var slideTargetId = handle.parentNode.getAttribute("data-slider-target");
  if(slideTargetId){
    var slideTarget = document.getElementById(slideTargetId),
      copyNotice = document.getElementById("copy-notice"),
      fontSize;
  }


  document.onmousemove = function(e){ 
    mouseX = e.clientX;
    offsetLeft = mouseX - mouseOffsetX;
    if(offsetLeft > 0 && offsetLeft <= sliderWidth){
      handle.style.left = offsetLeft + 'px';
      if(activeSegment) activeSegment.style.width = offsetLeft + "px";
    }else if(offsetLeft > sliderWidth){
      handle.style.left = sliderWidth+'px';
      if(activeSegment) activeSegment.style.width = sliderWidth + "px";
    }else{
      handle.style.left = '0px';
      if(activeSegment) activeSegment.style.width = "0px";
    }

    if(slideTargetId == "photo_copyright_opacity"){
      copyNotice.style.opacity = offsetLeft/sliderWidth;
    }

    if(slideTargetId == "photo_copyright_size"){
      fontSize = Math.round(offsetLeft / sliderWidth * copyNotice.parentNode.offsetHeight/4);
      if(fontSize > 6){
        copyNotice.style.fontSize = fontSize + "px";
      }else{
        copyNotice.style.fontSize = "6px";
      }
    }
  }

  document.onmouseup = function(){ 
    var positionLeft = parseInt(handle.style.left),
    offsetLeft = round(positionLeft/sliderWidth);
    var activeSegment = handle.parentNode.getElementsByClassName("active-segment")[0];
    activeSegment.style.width = positionLeft +"px";
    
    document.onmousemove = function(){}
    document.onmouseup = function(){}

    //specific to app
    if(slideTargetId){
      slideTarget.value = offsetLeft;

      if(slideTargetId == "photo_copyright_opacity"){
        var copyNotice = document.getElementById("copy-notice");
        copyNotice.style.opacity = offsetLeft;
      }

      if(slideTargetId == "photo_copyright_size"){
        var copyNotice = document.getElementById("copy-notice"),
          fontSize = Math.round(offsetLeft * copyNotice.parentNode.offsetHeight/4);
        if(fontSize > 6){
          copyNotice.style.fontSize = fontSize + "px";
        }else{
          copyNotice.style.fontSize = "6px";
        }
      }
    }
  }
}

function round(number){
  return Math.round(number * 100000) /100000;
}
