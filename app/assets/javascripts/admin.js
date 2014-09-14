//
//= require draggable
//= require photos
//= require user_settings
//

window.addEventListener("load", function admin(){
  window.removeEventListener("load", admin, false);
  var flashes = document.getElementsByClassName("flash");
  for(i = 0; i<flashes.length; i++){
    flashes[i].addEventListener("click", function(){
      this.style.display = "none";
    });
  }

  var inputs = document.getElementsByTagName("input");
  
  for(i=0;i<inputs.length;i++){
    if(inputs[i].type == "checkbox"){
      if(inputs[i].checked) inputs[i].parentNode.className = inputs[i].parentNode.className + " selected";

      inputs[i].addEventListener("change", function(){
        if(this.parentNode.className.indexOf("selected") == -1){
          this.parentNode.className = this.parentNode.className + " selected";
        }else{
          this.parentNode.className = this.parentNode.className.replace(" selected","");
        }
      },false);
    }
  }
},false);
