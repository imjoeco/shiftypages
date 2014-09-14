// This file handles the post rendering.

var content = document.getElementById("post-content"),
  images, contentImages, sizeMarker;

window.addEventListener("load", function posts(e){
  window.removeEventListener("load", posts, false);
  if(content){
    images = content.getElementsByTagName("img");
 
    //add ids to content p's and scroll to URL target if present
    wrapPs();

    for(i = 0; i < images.length; i++){
      //fix text padding around images
      if(images[i].style.float == "right"){
        images[i].style.marginLeft = "18px";
      } else if(images[i].style.float == "left"){
        images[i].style.marginRight = "18px";
      }

      //wrap images with borders
      //images[i].outerHTML = '<div class="image-border">'+images[i].outerHTML+'</div>'

      //add event listeners to post images for expansion
      images[i].addEventListener("click", function(){
        if(this.className.indexOf("expanded-image") > -1){
          this.className = this.className.replace(" expanded-image","");

          sizeMarker = this.dataset.regularSize;
          if(window.outerWidth <= 768) sizeMarker = 'm'; 
          if(window.outerWidth <= 420) sizeMarker = 't';

          this.src = this.src.replace(/_[b]\./,"_"+sizeMarker+".");
        }else{
          if(!this.dataset.regularSize){
            this.dataset.regularSize = this.src[this.src.length - 5];
          }
          this.className += " expanded-image";

          this.src = this.src.replace(/_[anmt]\./,"_b.");
        }
      },false);
    }

    window.addEventListener("resize", function(){
      resizeImages();
    }, false);

    resizeImages();
  }
}, false);

function resizeImages(){
  content = document.getElementById("post-content");
  contentImages = content.getElementsByTagName("img");
  sizeMarker = 'n';
  if(window.outerWidth <= 900){
    sizeMarker = 'm';
  }
  if(window.outerWidth <= 420){
    sizeMarker = 't';
  }

  for(i=0;i<contentImages.length;i++){
    if(!contentImages[i].dataset.regularSize){
      contentImages[i].dataset.regularSize = contentImages[i].src[contentImages[i].src.length - 5];
    }

    if(contentImages[i].dataset.regularSize == 'n'){
      contentImages[i].src = contentImages[i].src.replace(/_[anmt]\./,'_'+sizeMarker+'.');
    }
  }
}

function wrapPs(){
  content = document.getElementById("post-content");
  contentPs = content.getElementsByTagName("p");
  if(contentPs.length == 0){
    contentPs = content.getElementsByTagName("div");
  }

  for(i=0; i<contentPs.length; i++){
    //set paragraph id
    contentPs[i].id = "para"+i;
    //add
    //contentPs[i].addEventListener("click", function(){
    //  //make sure click isn't a text selection event
    //  if(getSelectionText() == ""){
    //    if(/para[0-9]+/.test(location.href)){
    //      //make sure state isn't already current
    //      if(history.state.paragraphId != this.id){
    //        history.pushState(
    //          {paragraphId: this.id},
    //          document.title,
    //          location.href.replace(/para[0-9]+/, this.id)
    //        );
    //      }
    //    }
    //    else{
    //      history.pushState(
    //        {paragraphId: this.id},
    //        document.title,
    //        location.href + "#" + this.id
    //      );
    //    }
    //  }
    //},false);
  }

  if(/para[0-9]+/.test(location.href) && contentPs.length > 0){
    document.getElementById(location.href.match(/para[0-9]+/)[0]).scrollIntoView();
  }
}

function getSelectionText(){
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
