//This file controls pretty much everything for photo uploads.

window.addEventListener("load", function photos(e){
  window.removeEventListener("load", photos, false);

  var imagePreview = document.getElementById("image-preview");
  if(imagePreview){
    var copyNotice = document.getElementById("copy-notice");
    var copyBlock = document.getElementById("notice-settings");
    
    //listen for photo drag and drops
    dropSites = document.getElementsByClassName('image-drop');
    for(i=0;i<dropSites.length;i++){
      dropSites[i].addEventListener('dragover', imageHover, false);
      dropSites[i].addEventListener('dragleave', imageHover, false);
      dropSites[i].addEventListener('drop', imageDrop, false);
    }

    //load image preview after file selection
    document.getElementById("photo_image").addEventListener("change", function(){
      readURL(this);
      document.getElementById("finalize-photo").style.display = "block";
    },false);

    //listener for "Add Copyright" button
    document.getElementById("add-copyright").addEventListener("click", function(){
      //set initial copyright notice text
      document.getElementById("photo_copyright_notice").value = this.dataset.notice;
      copyNotice.innerHTML = this.dataset.notice;

      //set initial copyright position
      var leftOffset = document.getElementById("photo_copyright_left_offset").value,
        topOffset = document.getElementById("photo_copyright_top_offset").value;
      if(leftOffset){
        copyNotice.style.left = (leftOffset * imagePreview.offsetWidth) + "px";
      }
      if(topOffset){
        copyNotice.style.top = (topOffset * imagePreview.offsetHeight) + "px";
      }
      
      //set initial copyright color
      var colorValue = document.getElementById("photo_copyright_color").value;
      if(colorValue){
        copyNotice.style.color = "#"+colorValue;
      }

      //set initial copyright opacity
      var opacityValue = document.getElementById("photo_copyright_opacity").value;
      if(opacityValue){
        copyNotice.style.opacity = opacityValue;
      }

      //set initial copyright size
      var sizeValue = document.getElementById("photo_copyright_size").value;
      if(sizeValue){
        copyNotice.style.fontSize = Math.round(sizeValue * imagePreview.offsetHeight / 4) + "px";
      }

      //display  copyright notice
      copyNotice.style.display = "block";
      copyBlock.style.display = "block";
      document.getElementById("image-wrapper").style.borderBottom = "1px solid #ccc";

      //hide "Add Copyright" button
      this.style.display = "none";
    },false);
    
    // set copyright notice text listener
    document.getElementById("photo_copyright_notice").addEventListener("change", function(){
      copyNotice.innerHTML = this.value;
      if(this.value == ""){
        copyNotice.style.display = "none";
        copyBlock.style.display = "none";
        document.getElementById("image-wrapper").style.borderBottom = "none";
        document.getElementById("add-copyright").style.display = "block";
      }
    },false);

    //set copyright color listener
    document.getElementById("photo_copyright_color").addEventListener("change", function(){
      copyNotice.style.color = "#" + this.value;
    },false);

    //listen for copy notice centers
    document.getElementById("notice-center").addEventListener("click", function(){
      var centerOffset = (imagePreview.offsetWidth / 2) - (copyNotice.offsetWidth / 2);
      copyNotice.style.left = centerOffset + "px";
    },false);

    //listen for set new copy notice default settings
    document.getElementById("update-copy-notice").addEventListener("click", function(){
      updateDefaultNotice();
    },false);

    //event listeners for slider controls located in slider.js
  }
}, false);

function imageDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById("photo_image").files = e.dataTransfer.files;
}

function imageHover(e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'copy'; 
}

function updateDefaultNotice(){
  // from http://www.openjs.com/articles/ajax_xmlhttp_using_post.php
  var xhr = new XMLHttpRequest();

  var noticeSlug = document.getElementById("photo_copyright_notice").value
    .replace(/ /g,"+")
    .replace("&copy;",'#copy#')
    .replace("&nbsp;", '#nbsp#')
    .replace(/&/g,'#and#');
  var params = "notice="+ noticeSlug +
    "&opacity="+document.getElementById("photo_copyright_opacity").value +
    "&size="+document.getElementById("photo_copyright_size").value +
    "&leftOffset="+document.getElementById("photo_copyright_left_offset").value +
    "&topOffset="+document.getElementById("photo_copyright_top_offset").value +
    "&color="+document.getElementById("photo_copyright_color").value;

  xhr.open("POST","/update_copy_notice.json",true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));

  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      alert("Default notice successfully updated.");
    }
  }

  xhr.send(params);
}

function readURL(input) {
  // adapted from http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded

  //if (input.files && input.files[0]) {
  var reader = new FileReader();

  reader.onload = function (e) {
    if(e.target.result != null){
      var image = new Image();
      image.src = e.target.result;

      image.onload = function(){
        document.getElementById("photo_ow").value = this.width;
        document.getElementById("photo_oh").value = this.height;
        document.getElementById("image-preview").setAttribute("src", this.src);
      }
    }
  }

  document.getElementById('primary-drop').style.display = "none";
  if (input.files && input.files[0]) {
    reader.readAsDataURL(input.files[0]);
    document.getElementById('image-preview').style.display = "block";
  } else {
    reader.readAsDataURL(input);
    document.getElementById('image-preview').style.display = "block";
  }
}
