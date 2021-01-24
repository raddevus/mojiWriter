const RECENTLY_USED_MAX = 50;
let allSelectedElements = [];
let recentlyUsedEmojis = [];
let customEmojis = [];
let emojiSize = null;
let isXXLargeChecked = false;

// this selector makes it so currently selected emojis are not unselected.
document.querySelector("html").addEventListener("click", ()=>selectElementContents());

function initializeApp(){
  document.querySelector("#btncheck-xxlarge").addEventListener("click",xxLargeButtonHandler);
  document.querySelector("#saveCustomEmoji").addEventListener("click",saveCustomEmojiHandler);
  loadRecentsFromLocalStorage();
  loadCustomEmojisFromLocalStorage();
  initializeXXLargeChecked();
  initializeEmojiSize();
}

function initializeXXLargeChecked(){
  isXXLargeChecked = JSON.parse(localStorage.getItem("isXXLargeChecked"));
  if (isXXLargeChecked === null){
    isXXLargeChecked = false;
  }
  console.log(`isXXLargeChecked : ${isXXLargeChecked}`);
  document.querySelector("#btncheck-xxlarge").checked = isXXLargeChecked;
}

function initializeEmojiSize(){
  emojiSize = localStorage.getItem("emojiSize");
  if (emojiSize === null){
    emojiSize = "x-large";
    return;
  }
  updateEmojiDisplaySize();
}

function updateEmojiDisplaySize(){
  //iterate through and set the size of all emoji elements
  document.querySelectorAll(".emoji").forEach(emojiElement => {
    emojiElement.style.fontSize = emojiSize;
  });
}

function xxLargeButtonHandler(){
  console.log("xxlarge....");
  isXXLargeChecked = document.querySelector("#btncheck-xxlarge").checked;
  localStorage.setItem("isXXLargeChecked", isXXLargeChecked);
  if (isXXLargeChecked){
    emojiSize = "xx-large";
  }
  else{
    emojiSize = "x-large";
  }
  localStorage.setItem("emojiSize", emojiSize);
  updateEmojiDisplaySize();
}

function loadCustomEmojisFromLocalStorage(){
  customEmojis = JSON.parse(localStorage.getItem("customEmojis"));
  if (customEmojis === null){
    customEmojis = [];
    return;
  }
  customEmojis.forEach(emoji => {
    displayCustomEmojis(emoji);
  });
}

function loadRecentsFromLocalStorage(){
  recentlyUsedEmojis = JSON.parse(localStorage.getItem("recentEmojis"));
  if (recentlyUsedEmojis === null){
    // if null set to an empty array,
    // so array can later be pushed to
    recentlyUsedEmojis = [];
    return;
  }
  recentlyUsedEmojis.forEach(emoji => {
    displayRecentEmojis(emoji);
  });
}

function handleEmojiClick(el) {
  if (isSelected(el)){
    removeElement(el);
  	selectElementContents();
  }
  else{
  	allSelectedElements.push(el);
    selectElementContents();
    addEmojiToRecentList(el.innerHTML);
  }
}

function removeElement(el){
		foundItemIdx = 0;
    for (let i = 0;i < allSelectedElements.length;i++){
    	if (allSelectedElements[i] === el){
      	foundItemIdx = i;
        break;
      }
    }
    allSelectedElements.splice(foundItemIdx,1);
}
function isSelected(el){
  let retVal = false;
	allSelectedElements.forEach(a => {
  	if (a === el){
    	retVal = true;
    }
  });
	return retVal;
}

function selectElementContents() {
  allSelectedElements.forEach(el => {
  var range = document.createRange();
  range.selectNodeContents(el);
  var sel = window.getSelection();
  sel.addRange(range);
  });
}

function unselectAll(){
  allSelectedElements = [];
  window.getSelection().removeAllRanges();
}

function isEmojiNew(emoji, targetArrayToSearch){
  for (let i = 0; i < targetArrayToSearch.length;i++){
    if (targetArrayToSearch[i] === emoji){
      // if the emoji is already in the list
      // then just return
      console.log("returning...")
      return false;
    }
  }
  return true;
}

function addEmojiToRecentList(emoji){
  if (isEmojiNew(emoji,recentlyUsedEmojis) == false){
    return;
  }
  displayRecentEmojis(emoji);
  console.log("continuing...");
  // if it isn't already in the list, then add it and save
  // it to localStorage.
  recentlyUsedEmojis.push(emoji);
  if (recentlyUsedEmojis.length > RECENTLY_USED_MAX){
    recentlyUsedEmojis.shift();
  }
  
  localStorage.setItem("recentEmojis", JSON.stringify(recentlyUsedEmojis));
}

function displayRecentEmojis(emoji){
  const newSpan = document.createElement("span");
  newSpan.innerHTML = emoji;
  // the call to prepend() allows me to use normal forward iteration
  // thru the array but shows the most recently added emoji 
  // (highest index) first.
  document.querySelector("#v-pills-recent").prepend(newSpan);
  newSpan.addEventListener("click", emojiClickHandler);
}

function displayCustomEmojis(emoji){
  const newSpan = document.createElement("span");
  newSpan.innerHTML = emoji;
  // the call to prepend() allows me to use normal forward iteration
  // thru the array but shows the most recently added emoji 
  // (highest index) first.
  document.querySelector("#v-pills-custom").appendChild(newSpan);
  newSpan.addEventListener("click", emojiClickHandler);
}

function emojiClickHandler(el) {
  if (isSelected(el.target)){
    removeElement(el.target);
  	selectElementContents();
  }
  else{
  	allSelectedElements.push(el.target);
  	selectElementContents();
  }
}

function saveCustomEmojiHandler(){
  let allUserAddedEmojis = document.querySelector("#customEmojiText").value;
  for (let i = 0; i < allUserAddedEmojis.length;i++){
    let emoji = allUserAddedEmojis[i];
    if (isEmojiNew(emoji,customEmojis)){
      // if it's new, push it onto the list and write to to localstorage
      customEmojis.push(emoji);
      localStorage.setItem("customEmojis", JSON.stringify(customEmojis));
      displayCustomEmojis(emoji);
    }
  }
}