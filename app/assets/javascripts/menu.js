// This file controls the toggleable menus.

window.addEventListener("load", function menu(e){
  window.removeEventListener("load", menu, false);
  var toggles = document.getElementsByClassName('menu-toggle');
  for(i=0;i<toggles.length;i++){
    toggles[i].addEventListener("click", function(){
      targetId = this.dataset.menuId;
      closeMenusBut(targetId);
      toggleMenu(targetId);
    }, false);
  }
  document.getElementById("greyout").addEventListener("click", function(){
    closeMenusBut();
  },false);
  document.getElementById("clearout").addEventListener("click", function(){
    closeMenusBut();
  },false);
}, false);

function toggleMenu(targetId){
  var menu = document.getElementById(targetId),
    menuHeight = menu.scrollHeight + 1,
    clearout = document.getElementById("clearout"),
    greyout = document.getElementById("greyout");


  if(menu.className.indexOf("dropped") != -1){
    menu.style.marginTop = "-" + (menuHeight+80) + "px";
    menu.className = menu.className.replace(" dropped","");
    greyout.style.display = "none";
    clearout.style.display = "none";
  } else {
    menu.style.marginTop = "0px";
    menu.className = menu.className.concat(" dropped");
    if(menu.className.indexOf("shadow") != -1){
      greyout.style.display = "block";
    }
    if(menu.className.indexOf("clearout") != -1){
      clearout.style.display = "block";
    }
  }
}

function closeMenusBut(excludedId){
  var menus = document.getElementsByClassName("dropdown-menu");

  //close active menus
  for(i=0;i<menus.length;i++){
    menuHeight = menus[i].scrollHeight + 1;
    if(menus[i].className.indexOf("dropped") != -1 && menus[i].id != excludedId){
      menus[i].style.marginTop = "-" + (menuHeight+80) + "px";
      menus[i].className = menus[i].className.replace(" dropped","");
    }
  }

  document.getElementById("greyout").style.display = "none";
  document.getElementById("clearout").style.display = "none";
}
