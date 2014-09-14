window.addEventListener("load", function fedit(){
  //clean up load listener
  window.removeEventListener("load", fedit, false);

  //initialize editor
  createEditor();
      
  //insert contentEditable placeholder divs
  createPlaceholderFields();

  //resize margins if window is resized
  window.addEventListener("resize", resizeMargin, false);

  //show editor if width is >840px after resize
  window.addEventListener("resize", showEditor, false);
},false);

function createEditor(){
  var feditor = document.createElement("div"),
      feditorContainer = document.createElement("div"),
      newButton,
      newButtonText,
      currentSelection;
  
  feditorContainer.id = "feditor-container";
  document.body.insertBefore(feditorContainer,document.body.firstChild);

  var openEditor = document.createElement("div");
  openEditor.id = "open-feditor";
  openEditor.innerHTML = '<i class="icomoon-down-arrow"></i> Open Editor <i class="icomoon-down-arrow"></i>';
  openEditor.addEventListener("mousedown", function(e){
    e.preventDefault();
    currentSelection = saveSelection();
  },false);
  feditorContainer.appendChild(openEditor);

  feditor.id = "feditor";
  feditorContainer.appendChild(feditor);

  createImageForm();
  createVideoForm();
  createLinkForm();
  createAnchorForm();

  var buttonList = [
    {name:"Undo", action:"undo", icon:"undo", className:"hide-small"},
    {name:"Redo", action:"redo", icon:"redo"},
    {name:"Bold", action:"bold", icon:"bold"},
    {name:"Italic", action:"italic", icon:"italic"},
    {name:"Underline", action:"underline", icon:"underline"},
    {name:"Strikethrough", action:"strikethrough", icon:"strikethrough"},
    {name:"Superscript", action:"superscript", icon:"superscript"},
    {name:"Subscript", action:"subscript", icon:"subscript"},
    {name:"Justify Left", action:"justifyLeft", icon:"paragraph-left"},
    {name:"Justify Center", action:"justifyCenter", icon:"paragraph-center"},
    {name:"Justify Right", action:"justifyRight", icon:"paragraph-right"},
    {name:"Justify Full", action:"justifyFull", icon:"paragraph-justify"},
    {name:"Unordered List", action:"insertUnorderedList", icon:"list"},
    {name:"Ordered List", action:"insertOrderedList", icon:"numbered-list"},
//    {name:"Add Table", action:"addTable", icon:"table"},
    {name:"Add Image", action:"showForm", icon:"image", formAction:"addImage", className:"fedit-image-button"},
    {name:"Add Video", action:"showForm", icon:"film", formAction:"addVideo"},
    {name:"Link", action:"showForm", icon:"link", formAction:"addLink"},
    {name:"Insert Anchor", action:"showForm", icon:"flag", formAction:"addAnchor"},
    {name:"View Source", action:"viewSource", icon:"code"}
  ]

  feditorContainer.style.display = "none";
  resizeMargin();

  openEditor.addEventListener("click",function(){
    showEl(feditor);
  },false);

  feditor = document.getElementById("feditor");

  createButton({
    name:"Undo", 
    action:"undo", 
    icon:"undo", 
    className:"show-small"
  }, feditor);

  var tagSelect = appendSelect({
    appendTo:feditor,
    selectOptions:[
      {label:'h1', value:'<h1>'},
      {label:'h2', value:'<h2>'},
      {label:'h3', value:'<h3>'},
      {label:'h4', value:'<h4>'},
      {label:'h5', value:'<h5>'},
      {label:'h6', value:'<h6>'},
      {label:'p', value:'<p>'},
      {label:'div', value:'<div>'},
      {label:'pre', value:'<pre>'}
    ],
    defaultValue:"<div>"
  });

  //listen for changes to format block
  tagSelect.addEventListener("change", function(){
    document.execCommand("formatBlock", false, this.options[this.selectedIndex].value);
  },false);

  for(k=0;k<buttonList.length;k++){
    createButton(buttonList[k], feditor);
  }

  var hideEditor = document.createElement("div");
  hideEditor.id = "hide-feditor";
  hideEditor.innerHTML = '<i class="icomoon-up-arrow"></i> Hide Editor <i class="icomoon-up-arrow"></i>';

  hideEditor.addEventListener("mousedown",function(e){
    e.preventDefault();
    hideEl(feditor);
  },false);

  feditor.appendChild(hideEditor);
}


function createPlaceholderFields(){
  var form, 
      inputs,
      placeholder,
      placeholderContent,
      fedits = document.getElementsByClassName("fedit");

  for(j=0;j<fedits.length;j++){
    form = fedits[j];
    inputs = form.querySelectorAll("input[type='text'], textarea");

    for(i=0;i<inputs.length;i++){
      placeholder = document.createElement("div");

      placeholder.id = "fedit-"+j+""+i;
      placeholder.contentEditable = true;
      placeholder.className = "fedit-field";
      if(/no-fedit/.test(inputs[i].className)){
        placeholder.className = placeholder.className + " no-feditor";
      }

      placeholder.innerHTML = inputs[i].value;
      placeholder.addEventListener("blur", function(){
        this.nextSibling.value = this.innerHTML;
      },false);

      if(inputs[i].className.indexOf("no-fedit") == -1){
        placeholder.addEventListener("focus", function(){
          showEl(document.getElementById("feditor-container"));
        },false);

        inputs[i].parentNode.insertBefore(placeholder,inputs[i]);
        placeholder.dataset.inputId = inputs[i].id;

        if(placeholder.innerHTML.indexOf("<div>") == -1){
          placeholder.innerHTML = "<div>"+placeholder.innerHTML+"</div>";
          placeholder.nextSibling.value = placeholder.innerHTML;
        }
      }
      else{
        placeholder.addEventListener("focus", function(){
          hideEl(document.getElementById("feditor-container"));
        },false);

        inputs[i].parentNode.insertBefore(placeholder,inputs[i]);
        placeholder.dataset.inputId = inputs[i].id;
      }

      inputs[i].style.display = "none";
    }
  }
  addDeleteListeners();
}

//======================== Form Creation ==============================
var  form, formClose, formLabel, formFields;
function createBaseForm(options){
  form = document.createElement("div");
  form.className = "fedit-form";
  form.id = "fedit-"+options.action+"-form";
  form.style.display = "none";

  options.appendTo.appendChild(form);

  formClose = document.createElement("a");
  formClose.href = "javascript:void(0)";
  formClose.className = "fedit-form-close";
  formClose.innerHTML = "X";

  formClose.addEventListener("mousedown", function(e){
    e.preventDefault();
    closeForm(document.getElementById("fedit-"+options.action+"-form"));
  }, false);

  form.appendChild(formClose);

  formLabel = document.createElement("div");
  formLabel.className = "fedit-form-label";
  formLabel.innerHTML = options.label;
  form.appendChild(formLabel);

  formFields = document.createElement("div");
  formFields.className = "fedit-form-fields";

  form.appendChild(formFields);

  if(typeof options.fieldId != "undefined"){
    appendTextField({
      fieldLabel:options.fieldLabel, 
      fieldId:options.fieldId,
      appendTo:formFields
    });
  }
  
  createButton({
    name:"Insert "+ options.label, 
    action:options.action,
    className:"fedit-form-button"
  }, form); 
  return form;
}

function createImageForm(){
  var imageForm = createBaseForm({
    label:"Image", 
    fieldLabel:"Link", 
    action:"addImage",
    fieldId:"image-link-field",
    appendTo:document.getElementById("feditor-container")
  });

  var imageFields = imageForm.getElementsByClassName("fedit-form-fields")[0];

  appendInnerLabel({
    label:"Float",
    appendTo:imageFields
  });

  var floatSelect = appendSelect({
    selectId:"image-float-field",
    appendTo:imageFields,
    selectOptions:['none','right','left']
  });

  appendInnerLabel({
    label:"Align",
    appendTo:imageFields
  });

  var alignSelect = appendSelect({
    selectId:"image-align-field",
    appendTo:imageFields,
    selectOptions:['left','center','right']
  });

  //load shiftypages images if present
  loadImages();
}

function createVideoForm(){
  var videoForm = createBaseForm({
    label:"Video", 
    fieldLabel:"Link", 
    action:"addVideo",
    fieldId:"video-link-field",
    appendTo:document.getElementById("feditor-container")
  });
}

function createLinkForm(){
  feditorContainer = document.getElementById("feditor-container");

  var linkForm = createBaseForm({
    label:"Link", 
    action:"addLink",
    appendTo:feditorContainer
  });

  var linkFormFields = linkForm.getElementsByClassName("fedit-form-fields")[0];

  appendTextField({
    fieldLabel:"Text", 
    fieldId:"link-text-field",
    appendTo:linkFormFields
  });

  appendTextField({
    fieldLabel:"URL", 
    fieldId:"link-href-field",
    appendTo:linkFormFields
  });
}

function createAnchorForm(){
  var anchorForm = createBaseForm({
    label:"Anchor", 
    fieldLabel:"Name", 
    action:"addAnchor",
    fieldId:"anchor-name-field",
    appendTo:document.getElementById("feditor-container")
  });
}

//================== Form Field injection ============================

var fieldLabel,fieldInput;

function appendTextField(options){
  if(typeof options.fieldLabel != "undefined"){
    appendInnerLabel({
      label:options.fieldLabel,
      appendTo:options.appendTo
    });
  }

  fieldInput = document.createElement("input");
  fieldInput.type = "text";
  fieldInput.className = "fedit-form-field";
  if(typeof options.fieldId != "undefined"){
    fieldInput.id = options.fieldId;
  }
  options.appendTo.appendChild(fieldInput);
}

var select, optionList, option;

function appendSelect(options){
  select = document.createElement("select");
  select.className = "fedit-select";

  if(typeof options.selectId != "undefined"){
    select.id = options.selectId;
  }

  optionList = options.selectOptions;

  for(i=0;i<optionList.length;i++){
    option = document.createElement("option");

    if(typeof optionList[i].label != "undefined"){
      option.value = optionList[i].value;
      option.innerHTML = optionList[i].label;
    }
    else{
      option.value = optionList[i];
      option.innerHTML = optionList[i];
    }

    //select default value if present
    if(typeof options.defaultValue != "undefined"){
      if(option.value == options.defaultValue){
        option.selected = true;
      }
    }

    select.appendChild(option);
  }

  if(typeof options.appendTo != "undefined"){
    options.appendTo.appendChild(select);
  }

  return select;
}

var label;

function appendInnerLabel(options){
  label = document.createElement("div");

  label.innerHTML = options.label;
  label.className = "fedit-inner-label";
  label.style.display = "inline-block";
  label.style.float = "left";
  options.appendTo.appendChild(label);
}

//function reloadSelectOptions(options){
//  var selectOptions = options.options,
//  select = options.select;
//}

function createButton(buttonObj, insertTarget){
  //create new fedit button
  newButton = document.createElement("a");

  if(typeof buttonObj.className != "undefined"){
    newButton.className = buttonObj.className + " " + buttonObj.action + " fedit-button";
  }
  else{
    newButton.className = "fedit-button " + buttonObj.action;
  }

  if(buttonObj.action != "showForm"){
    newButton.id = buttonObj.action + "-button";
  }

  newButton.href = "javascript:void(0)";
  newButton.title = buttonObj.name;

  if(typeof buttonObj.icon != "undefined"){
    newButton.innerHTML = '<i class="icomoon-'+ buttonObj.icon +'"></i>';
  }
  else{
    newButton.innerHTML = buttonObj.name;
  }
  
  newButton.addEventListener("mousedown", function(e){
    e.preventDefault();

    if(buttonObj.action == "viewSource"){
      //if changing from js created fedit field
      if(parentWithId(getSelectionParentElement(), "fedit-") != null){
        feditParent = parentWithId(getSelectionParentElement(), "fedit-");
        feditField = (document.getElementById(feditParent.dataset.inputId));

        if(typeof feditParent != "undefined"){
          feditField.value = feditParent.innerHTML;
          toggleDisplay(feditParent);
          toggleDisplay(feditField);
        }
      }

      //if changing from original form field
      else if(typeof feditParent != "undefined"){
        feditParent.innerHTML = feditField.value;
        toggleDisplay(feditParent);
        toggleDisplay(feditField);
      }
    } 

    else if(buttonObj.action == "showForm"){
      currentSelection = saveSelection();
      hideEl(document.getElementById("feditor"));

      if(buttonObj.formAction == "addLink"){
        document.getElementById("link-text-field").value = currentSelection;
        //reloadSelectOptions({});
      }

      closeForms();
      showEl(document.getElementById("fedit-"+buttonObj.formAction+"-form"));
    }

    else if(buttonObj.action == "addAnchor"){
      insertAnchor(document.getElementById("anchor-name-field").value);
    }

    else if(buttonObj.action == "addLink"){
      insertLink(
        document.getElementById("link-text-field").value,
        document.getElementById("link-href-field").value
      );
    }

    else if(buttonObj.action == "addVideo"){
      insertVideo(document.getElementById("video-link-field").value);
    }

    else if(buttonObj.action == "addImage"){
      floatSelect = document.getElementById("image-float-field");
      alignSelect = document.getElementById("image-align-field");

      insertImage({
        imageURL:document.getElementById("image-link-field").value,
        floatVal:floatSelect.options[floatSelect.selectedIndex].value,
        alignVal:alignSelect.options[alignSelect.selectedIndex].value,
      });
    }

    else{
      document.execCommand(buttonObj.action);
    }

    if(buttonObj.action != "showForm"){
      closeForms();
      showEl(document.getElementById("feditor"));
    }
    resizeMargin();
  },false);

  //append button to editor
  insertTarget.appendChild(newButton);
}


//======================== Insertion Methods ==========================

function insertImage(options){
  //insert link
  insertText('<img src="'+
    options.imageURL+
    '" class="fedit-image" style="float:'+
    options.floatVal+
    '; text-align:'+
    options.alignVal+
    ';"></img>'
  );

  //clear field and hide form
  document.getElementById("image-link-field").value = "";

  //addDeleteListener(document.getElementById(anchorName), "Anchor");
}

function insertVideo(videoURL){
  videoURL = videoURL.replace(/http[s]?:/,"")
    .replace("youtu.be","youtube.com/embed")
    .replace("watch?v=","embed/")
    .replace("//vimeo.com","//player.vimeo.com/video");

  //insert link
  insertText('<div class="flex-video"><iframe src="'+videoURL+'" class="fedit-video" width="420" height="315" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe></div>');

  //clear field and hide form
  document.getElementById("video-link-field").value = "";

  //addDeleteListener(document.getElementById(anchorName), "Anchor");
}

function insertLink(linkText, linkURL){
  //insert link
  insertText('<a href="'+linkURL+'" class="fedit-link">'+linkText+'</a>');

  //clear field and hide form
  document.getElementById("link-text-field").value = "";
  document.getElementById("link-href-field").value = "";

  //addDeleteListener(document.getElementById(anchorName), "Anchor");
}

function insertAnchor(anchorName){
  //insert link
  insertText('<a id="'+anchorName+'" class="fedit-anchor">');

  //clear field and hide form
  document.getElementById("anchor-name-field").value = "";

  //addDeleteListener(document.getElementById(anchorName), "Anchor");
}

function insertText(insertString){
  restoreSelection(currentSelection);
  document.execCommand("insertHTML", false, insertString);
  addDeleteListeners();
}

//==================== General Utility Functions =======================

var deletableEls, feditFields;

function addDeleteListeners(){
  feditFields = document.getElementsByClassName("fedit-field");

  for(i=0;i<feditFields.length;i++){
    //this doesn't work for iframes
    deletableEls = feditFields[i].querySelectorAll("a, img, iframe");
    for(j=0;j<deletableEls.length;j++){
      if(deletableEls[j].tagName != "A" || deletableEls[j].className == "fedit-anchor"){
        deletableEls[j].addEventListener("mousedown", function deleteListener(e){
          e.preventDefault();
          if(confirm("Delete?")){
            this.parentNode.removeChild(this);
          }
        }, false);
      }
    }
  }
}

function closeForm(form){
  hideEl(form);
  showEl(document.getElementById("feditor"));
}

function closeForms(){
  var forms = document.getElementsByClassName("fedit-form");
  for(i=0;i<forms.length;i++){
    forms[i].style.display = "none";
  }
}

function resizeMargin(){
  feditorContainer = document.getElementById("feditor-container");
  feditorContainer.nextElementSibling.style.marginTop = feditorContainer.offsetHeight+"px";
}

function showEditor(){
  if(window.innerWidth > 840){
    document.getElementById("feditor").style.display = "";
    resizeMargin();
  }
}

function showEl(el){
  el.style.display = "block";
  resizeMargin();
}

function hideEl(el){
  el.style.display = "none";
  resizeMargin();
}

function toggleDisplay(el){
  if(el.style.display == "none"){
    showEl(el);
  }
  else{
    hideEl(el);
  }
}

function parentWithId(childEl, parentId){
  while(childEl.nodeName != "BODY"){
    if(childEl.id.indexOf(parentId) != -1){
      return childEl;
    }
    else{
      childEl = childEl.parentNode;
    }
  }
  return null;
}

// yoinked from http://stackoverflow.com/questions/7215479/get-parent-element-of-a-selected-text
function getSelectionParentElement() {
  var parentEl = null, sel;
  if(window.getSelection){
    sel = window.getSelection();
    if(sel.rangeCount){
      parentEl = sel.getRangeAt(0).commonAncestorContainer;
      if(parentEl.nodeType != 1){
        parentEl = parentEl.parentNode;
      }
    }
  }
  else if( (sel = document.selection) && sel.type != "Control"){
    parentEl = sel.createRange().parentElement();
  }
  return parentEl;
}//end yoink


// from http://stackoverflow.com/questions/4687808/contenteditable-selected-text-save-and-restore
function saveSelection() {
  if(window.getSelection){
    sel = window.getSelection();
    if(sel.getRangeAt && sel.rangeCount){
      return sel.getRangeAt(0);
    }
  } 
  else if(document.selection && document.selection.createRange){
    return document.selection.createRange();
  }
  return null;
}

function restoreSelection(range) {
  if (range) {
    if (window.getSelection) {
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.selection && range.select) {
      range.select();
    }
  }
}//end yoink

//========================= ShiftyPages Stuff =========================
function loadImages(){
  if(typeof photosJSON != "undefined" && photosJSON.length > 0){
    var postThumbs = document.createElement("div"),
        imageField = document.getElementById("image-link-field"),
        imageFields = document.getElementById("fedit-addImage-form").getElementsByClassName("fedit-form-fields")[0];

    postThumbs.id= "post-thumbnails";
    postThumbs.className = "non-fedit-div";

    var sizeSelect = appendSelect({
      selectId:"image-size",
      selectOptions:[
        {label:"Small", value:"s"},
        {label:"Medium", value:"n"},
        {label:"Large", value:"b"}
      ]
    });

    imageFields.insertBefore(sizeSelect, imageFields.firstChild);

    //set default size as medium
    sizeSelect.options[1].selected = true;

    //change image url field if size select changes
    sizeSelect.addEventListener("change", function(){
      imageField.value = imageField.value.replace(/_[asntb]\./,"_"+this.value+".");
    }, false);

    var liContainer;

    for(i=0;i<photosJSON.length;i++){
      liContainer = postThumbs.appendChild(document.createElement("li"));

      imageUrl = 'http://farm'+
        photosJSON[i].farm+
        '.staticflickr.com/'+
        photosJSON[i].server+'/'+
        photosJSON[i].flickr_id+'_'+
        photosJSON[i].secret+'_t.jpg';
      
      thumb = document.createElement("img");
      thumb.className = "post-thumbnail";
      thumb.src = imageUrl;
      thumb.dataset.imgUrl = imageUrl;

      thumb.addEventListener("mousedown", function(e){
        e.preventDefault();
        activeThumbs = document.getElementById("feditor-container").getElementsByClassName("active");
        for(j = 0;j < activeThumbs.length;j++){
          activeThumbs[j].className = activeThumbs[j].className.replace(" active","");
        }
        size = sizeSelect.options[sizeSelect.selectedIndex].value;
        imageField.value = sizeImage(imageUrl,size);
        this.className = this.className + " active";
      }, false);

      liContainer.appendChild(thumb);
    }

    imageFields.insertBefore(postThumbs, imageFields.childNodes[1]);

  }
}

function sizeImage(image, size){
  return image.replace(/_[a-z]{1}\./i,"_"+size+".");
}
