// This file handles moving things around in slideshow fashion

var activeNodes, target, targetListNode, targetCount, urlTarget, 
  currentTarget, keyCode, targets, targetSlider, targetList, 
  currentTargetId, parentNode, sliderNext, sliderPrev;

// will not work in browsers earlier than ie8 because of querySelectorAll
window.addEventListener("load", function tartar(e){
  window.removeEventListener("load", tartar, false);
  var targetLinks = document.querySelectorAll('[data-target-id]');

  if(targetLinks.length > 0){
    targets = document.getElementsByClassName('target-wrapper');
    targetSlider = document.getElementById("target-slider");
    targetList = document.getElementById("target-list");

    for(var i = 0; i < targetLinks.length; i++){
      targetLinks[i].addEventListener("click", function(e){
        e.preventDefault();
        if(targetSlider){
          slideToTarget(this.dataset.targetId);
        } else {
          activateTarget(this.dataset.targetId);
        }
      }, false);
    }
  }

  if(targetSlider){
    //wrapper inner content of targetSlider
    var targetSliderHTML = targetSlider.outerHTML;
    var targetWrapperIndex = targetSliderHTML.indexOf(">") + 1;
    targetSliderHTML = targetSliderHTML.slice(0,targetWrapperIndex) + 
      '<div class="target-slider-inner" style="left:0px;">' +
      targetSliderHTML.slice(targetWrapperIndex, targetSliderHTML.size) +
      '</div>';

    targetSlider.outerHTML = targetSliderHTML;
    
    //set initial target widths and targetSlider height
    resizeTargets();
    resizeToTarget();
    
    //resize targetSlider on window resize
    window.addEventListener("resize", function(){
      resizeTargets();
      resizeToTarget();
    });

    document.getElementById("target-slider").addEventListener("click", function(){
      changeUrlTarget(document.querySelectorAll(".target-wrapper.active")[0].id.replace("target-",""));
    }, false);
  }

  //check for target param in url and activate it or first target
  if(targetLinks.length > 0) activateUrlTarget();
  
  
  if(targetSlider){
    swipedetect(document.getElementById('target-slider'), function(swipedir){
      if(swipedir != 'none'){ 
        currentTarget = document.getElementsByClassName("target-wrapper active")[0];
        currentTargetId = parseInt(currentTarget.id.replace(/target-/,""));
        targets = document.getElementsByClassName("target-wrapper");

        if(swipedir =='left'){ 
          nextTarget = currentTargetId + 1;
        } else if(swipedir == 'right'){
          nextTarget = currentTargetId - 1;
        }

        if(nextTarget > -1 && nextTarget < targets.length){
          slideToTarget(nextTarget);
        }
      }
    });
  }
},false);

function activateUrlTarget(){
  if(/target[=-][0-9]+/.test(location.href)){
    targetCount = document.getElementsByClassName('target-wrapper').length;
    urlTarget = location.href.replace(
      /[a-z0-9\/:\?\&\#\.\-\_\%\~]+target[=-]/i,""
    ).replace(
      /&\S+/i, ""
    );
    if(urlTarget > -1 && urlTarget < targetCount){
      if(targetSlider){
        slideToTarget(urlTarget);
      }else{
        activateTarget(urlTarget);
      }
    }
  } else{
    if(targetSlider){
      slideToTarget(0);
    }else{
      activateTarget(0);
    }
  }
}

function activateTarget(targetId){

  //clear active class from previous target
  activeNodes = document.querySelectorAll(".active");
  for(var j = 0; j<activeNodes.length; j++){
    if(activeNodes[j].className != "undefined"){
      activeNodes[j].className = activeNodes[j].className
        .replace("active", '').replace("  "," ");
    }
  }

  //set target to active
  target = document.getElementById("target-" + targetId);
  target.className = target.className + " active";

  //target list operations
  if(targetList){
    targetList = document.getElementById("target-list");

    //set target list node to active
    targetListNode = targetList.querySelectorAll("[data-target-id='"+targetId+"']")[0];
    targetListNode.className = "active";

    //center selected target list node
    targetList.scrollLeft = targetListNode.offsetLeft - (targetList.offsetWidth/2) + (targetListNode.offsetWidth/4);
  }

  //update url
  //changeUrlTarget(targetId);
}

function slideToTarget(targetId){
  targetId = parseInt(targetId);
  currentTarget = document.getElementsByClassName("target-wrapper active")[0];
  currentTargetId = currentTarget.id.replace(/target-/,"");
  target = document.getElementById("target-" + targetId);
  sliderNext = document.getElementById("slider-next");
  sliderPrev = document.getElementById("slider-prev");

  //clear active class from previous target
  activeNodes = document.querySelectorAll(".active");
  for(var j = 0; j<activeNodes.length; j++){
    if(typeof activeNodes[j].className != "undefined"){
      activeNodes[j].className = activeNodes[j].className.replace("active", '').replace("  "," ");
    }
  }

  //set target to active
  target.className = target.className + " active";

  //target list operations
  if(targetList){
    targetList = document.getElementById("target-list");

    //set target list node to active
    targetListNode = targetList.querySelectorAll("[data-target-id='"+targetId+"']")[0];
    targetListNode.className = "active";

    //center selected target list node
    targetList.scrollLeft = targetListNode.offsetLeft - (targetList.offsetWidth/2) + (targetListNode.offsetWidth/4);
  }

  //update url
  //changeUrlTarget(targetId);

  //update edit link if present
  changeEditTarget(target);

  //adjust slider height to new target height
  resizeToTarget();

  //move targetSlider to target
  moveToTarget();

  targetsLength = document.getElementsByClassName("target-wrapper").length;
  if(sliderNext){
    nextTargetId = targetId + 1;
    if(nextTargetId < targetsLength){
      sliderNext.dataset.targetId = nextTargetId; 
      sliderNext.style.display = "block";
    } else {
      sliderNext.style.display = "none";
    }
  }
  if(sliderPrev){
    prevTargetId = targetId - 1;
    if(prevTargetId >= 0){
      sliderPrev.dataset.targetId = prevTargetId; 
      sliderPrev.style.display = "block";
    } else {
      sliderPrev.style.display = "none";
    }
  }
}

function moveToTarget(){
  target = document.getElementsByClassName("target-wrapper active")[0];
  sliderInner = document.getElementsByClassName("target-slider-inner")[0];
  targetOffset =  target.offsetLeft * -1;
  sliderInner.style.left = targetOffset + "px";
}

function resizeToTarget(){
  //set height for targetSlider to target height
  target = document.getElementsByClassName("target-wrapper active")[0];
  document.getElementById("target-slider").style.height = target.offsetHeight + "px";

  if(sliderNext && /photo-control/.test(sliderNext.className)){
    sliderNext.style.height = target.getElementsByTagName("img")[0].offsetHeight + "px";
    sliderNext.style.top = document.getElementById("page-title").offsetHeight + "px";
    //sliderNext.style.top = target.getElementsByTagName("img")[0] + "px";
  }
  if(sliderPrev && /photo-control/.test(sliderPrev.className)){
    sliderPrev.style.height = target.getElementsByTagName("img")[0].offsetHeight + "px";
    sliderPrev.style.top = document.getElementById("page-title").offsetHeight + "px";
  }
}

function resizeTargets(){
  //this is .target-slider-inner
  parentNode = targets[0].parentNode;

  //this is the width of #target-slider
  parentWidth = Math.round(parentNode.parentNode.offsetWidth);

  //set width to parentWidth for all target elements
  for(i=0;i<targets.length;i++){
    targets[i].style.width = parentWidth + "px";
  }

  //set the width of #target-slider-inner to the width of all targets
  parentNode.style.width = parentWidth * targets.length + "px";

  //set the left offset
  offset = document.getElementsByClassName("target-wrapper active")[0].offsetLeft;

  parentNode.style.left = Math.round(offset * -1) + "px";
}

function changeUrlTarget(targetId){

  //change url target params if it exists
  if(/target[=-][0-9]+/.test(location.href)){
    history.pushState(
      {target: targetId},
      document.title,
      location.href.replace(/target[=-][0-9]+/,"target="+targetId)
    );
  } else{
    if(/[?]/.test(location.href)){
      history.pushState(
        {target: targetId},
        document.title,
        location.href+"&target="+targetId
      );
    }else{
      history.pushState(
        {target: targetId},
        document.title,
        location.href+"?target="+targetId
      );
    }
  }
}

var editLink;

function changeEditTarget(target){
  editLink = document.getElementById("edit_link");
  if(editLink != null && typeof target.dataset.postId != "undefined"){
    editLink.href = "/posts/" + target.dataset.postId +"/edit";
  }
}

document.onkeyup = keyPress;

//var directionalKeyCodes = ["'","%","A","D","H","L"];
var directionalKeyCodes = /['%ADHLfd]/;

function keyPress(event) {
  keyCode = String.fromCharCode(event.keyCode || event.charCode);

  if(directionalKeyCodes.test(keyCode)){
    if(targetList && !targetSlider){
      //refresh targetList with current dom
      targetList = document.getElementById("target-list");
      currentTarget = targetList.getElementsByClassName("active")[0];
      if(currentTarget != null){
        targetId = parseInt(currentTarget.dataset.targetId);
        if(/['DLf]/.test(keyCode)){
          nextTarget = targetId+1;
        }
        else{
          nextTarget = targetId-1;
        }
        if(nextTarget > -1 && nextTarget < targets.length){
          activateTarget(nextTarget);
        }
      }
    } 
    
    if(targetSlider){
      //refresh targetSlider with current dom
      targetSlider = document.getElementById("target-slider");
      currentTarget = targetSlider.getElementsByClassName("active")[0];
      if(currentTarget != null){
        targetId = parseInt(currentTarget.id.replace(/[a-z]+-/i,""));
        if(/['DLf]/.test(keyCode)){
          nextTarget = targetId+1;
        }
        else{
          nextTarget = targetId-1;
        }
        if(nextTarget > -1 && nextTarget < targets.length){
          slideToTarget(nextTarget);
        }
      }
    }
  }
}

//from http://www.javascriptkit.com/javatutors/touchevents2.shtml
function swipedetect(el, callback){
 
 var touchsurface = el,
 touchobj,
 swipedir,
 startX,
 startY,
 distX,
 distY,
 threshold = 100, //required min distance traveled to be considered swipe
 allowedTime = 500, // maximum time allowed to travel that distance
 elapsedTime,
 startTime,
 handleswipe = callback || function(swipedir){}
 
 touchsurface.addEventListener('touchstart', function(e){
  touchobj = e.changedTouches[0];
  swipedir = 'none';
  distX = 0;
  distY = 0;
  startX = touchobj.pageX;
  startY = touchobj.pageY;
  startTime = new Date().getTime();// record time when finger first makes contact with surface
  //e.preventDefault()
 
 }, false)
 
  touchsurface.addEventListener('touchmove', function(e){
    touchobj = e.changedTouches[0];
    distY = touchobj.pageY - startY;
    window.scroll(0, distY);
  }, false)

  touchsurface.addEventListener('touchend', function(e){
    touchobj = e.changedTouches[0];
    distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
    elapsedTime = new Date().getTime() - startTime; // get time elapsed
    if (elapsedTime <= allowedTime){ // first condition for awipe met
      if (Math.abs(distX) >= threshold){ // 2nd condition for horizontal swipe met
        swipedir = (distX < 0)? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
      }
    }
    handleswipe(swipedir);
    //e.preventDefault();
  }, false)
}
