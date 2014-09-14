// Sneak in a copyright notice on app creation.
window.addEventListener("load", function user_settings(e){
  window.removeEventListener("load", user_settings, false);
  var titleInput = document.getElementById('user_setting_title');
  if(titleInput != null){
    var copyNotice;

    titleInput.addEventListener("change", function(){
      copyNotice = document.getElementById('user_setting_copy_notice');
      copyNotice.value = "&copy; Copyright " + titleInput.value;
    }, false);
  }
}, false);
