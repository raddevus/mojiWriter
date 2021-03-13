const RECENTLY_USED_MAX = 50;
let allSelectedElements = [];
let recentlyUsedEmojis = [];
let customEmojis = [];
let isXXLargeChecked = false;


function initApp(){
  attachEmojiClickListeners();
  document.querySelector("#btncheck-xxlarge").addEventListener("click",xxLargeButtonHandler);
  // this selector makes it so currently selected emojis are not unselected.
  document.querySelector("html").addEventListener("click", ()=>displaySelectedElements());
  document.querySelector("#saveCustomEmoji").addEventListener("click",saveCustomEmojiHandler);

  loadRecentsFromLocalStorage();
  loadCustomEmojisFromLocalStorage();
  initializeXXLargeChecked();
  initializeEmojiSize();
}

function attachEmojiClickListeners(){
    console.log("in attachEmojiClickListeners...");
    // First get the collection of Nodes that we want to work with
    // and store the collection in a variable for later use
    let allNodes = document.querySelectorAll(".emoji span");

    // Next, use a for/of to iterate over each Node in the collection
    for (let node of allNodes){
        node.addEventListener("click", function() {
            handleEmojiClick(node);
        }) // end of addEventListener function
    } // end of for/of
} // end of function

function handleEmojiClick(el) {
    if (el.target !== undefined){
      el = el.target;
    }
    if (isSelected(el)){
        removeElement(el);
    }
    else{
        allSelectedElements.push(el);
        addEmojiToRecentList(el.innerHTML);
    }
    displaySelectedElements(el.innerHTML);
}

function displayRecentEmojis(emoji){
  const newSpan = document.createElement("span");
  newSpan.innerHTML = emoji;
  // the call to prepend() allows me to use normal forward iteration
  // thru the array but shows the most recently added emoji 
  // (highest index) first.
  document.querySelector("#recent-tab").prepend(newSpan);
  newSpan.addEventListener("click", handleEmojiClick);
}

function loadRecentsFromLocalStorage(){
  // First we load the item we stored in localStorage but we need to call parse()
  // on it so it will be turned back into an array.  If we don't, it'll be a string.
  recentlyUsedEmojis = JSON.parse(localStorage.getItem("recentEmojis"));
  // Next, we check to see if the array is null because if there are no 
  // items stored in localStorage named "recentEmojis" then the JSON.parse() will 
  // return a null value.  if it is null there is nothing left to do, so 
  // we return from the function.
  if (recentlyUsedEmojis === null){
    // if null set to an empty array,
    // so array can later be pushed to
    recentlyUsedEmojis = [];
    return;
  }
  // if there are some emojis then they've been loaded into our array
  // Now we iterate through them and call the displayRecentEmojis()
  // which will display them in the Recent tab.
  recentlyUsedEmojis.forEach(emoji => {
    displayRecentEmojis(emoji);
  });
}

 function addEmojiToRecentList(emoji){
    // 1. determine if the emoji is a new one - if it isn't then 
    // return out of this method because there is nothing more
    // to do since the emoji has already been added to recent list
    if (isEmojiNew(emoji,recentlyUsedEmojis) == false){
      return;
    }
   // 2. do the work to display the recent emojis
   // this will require some work to add new spans to our DOM.
   // Yes, you can add new HTML elements to the DOM dynamically with JS
    displayRecentEmojis(emoji);
  
    // if the emoji isn't already in the list, then add it and save
    // it to localStorage.
   // 3. Push the emoji on the array we are using to track this list
    recentlyUsedEmojis.push(emoji);
    // 4. We need to only allow this list to get so large because we only want the last 
   // X number of recent emojis used so we use a number like 50.
    if (recentlyUsedEmojis.length > RECENTLY_USED_MAX){
      recentlyUsedEmojis.shift();
    }
    // 5. Finally, we use a method (JSON.stringify) to turn our array into a string
    // that we can store in localStorage.  You must stringify the array or you won't
   // be able to turn it back into an array later.
    localStorage.setItem("recentEmojis", JSON.stringify(recentlyUsedEmojis));
  }

  function isEmojiNew(emoji, targetArray){
    for (let i = 0; i < targetArray.length;i++){
      if (targetArray[i] === emoji){
        // if the emoji is already in the list
        // then just return -- this is a quick exit 
        // from the function when the emoji is found
        // early in the list
        console.log("returning...")
        return false;
      }
    }
    // The code will only get to here 
    // if the emoji wasn't found in the list.
    // We return true that it is a new emoji.
    return true;
  }
  
  
  
  function removeElement(el){
    let  foundItemIdx = -1;
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
  
  function displaySelectedElements() {
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

  function saveCustomEmojiHandler(){
    dismiss("warn-alert");
    dismiss("success-alert");
    
    if (document.querySelector("#customEmojiText").value == ""){
      document.querySelector("#empty-alert").style.display = "block";
      document.querySelector("#empty-alert").style.visibility = "visible";
      return;
    }
    let allUserAddedEmojis = Array.from(document.querySelector("#customEmojiText").value);
    document.querySelector("#customEmojiText").value = "";
    let atLeastOneFailure = false;
    for (let i = 0; i < allUserAddedEmojis.length;i++){
      let emoji = allUserAddedEmojis[i];
      if (isEmojiNew(emoji,customEmojis)){
        // if it's new, push it onto the list and write to to localstorage
        customEmojis.push(emoji);
        localStorage.setItem("customEmojis", JSON.stringify(customEmojis));
        displayCustomEmojis(emoji);
      }
      else{
        atLeastOneFailure = true;
      }
      if (atLeastOneFailure){
        document.querySelector("#warn-alert").style.display = "block";
        document.querySelector("#warn-alert").style.visibility = "visible";
      }
      else{
        // all successfully saved
        document.querySelector("#success-alert").style.display = "block";
        document.querySelector("#success-alert").style.visibility = "visible";
      }
    }
  }

  function displayCustomEmojis(emoji){
    const newSpan = document.createElement("span");
    newSpan.innerHTML = emoji;
    // set id to custom so that later we can use it to determine
    // if it is an item which can be added to the recently used list.
    newSpan.id = "custom";
    // the call to prepend() allows me to use normal forward iteration
    // thru the array but shows the most recently added emoji
    // (highest index) first.
    document.querySelector("#custom-tab").appendChild(newSpan);
    newSpan.addEventListener("click", handleEmojiClick);
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

  function dismiss(target){
    document.querySelector(`#${target}`).style.display = "none";
    document.querySelector(`#${target}`).style.visibility = "hidden";
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
  