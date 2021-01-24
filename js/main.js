let allSelectedElements = [];
// this selector makes it so currently selected emojis are not unselected.
document.querySelector("html").addEventListener("click", ()=>selectElementContents());

function handleEmojiClick(el) {
  if (isSelected(el)){
    removeElement(el);
  	selectElementContents();
  }
  else{
  	allSelectedElements.push(el);
    selectElementContents();
    addRecentEmoji(el);
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

function addRecentEmoji(el){
  
  const newSpan = document.createElement("span");
  newSpan.innerHTML = el.innerHTML;
  document.querySelector("#v-pills-recent").appendChild(newSpan);
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
  console.log(el.target.innerHTML);
}