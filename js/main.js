let allSelectedElements = [];

document.querySelector("html").addEventListener("click", ()=>selectElementContents());

function handleEmojiClick(el) {
  
  //var el = document.querySelector("#a");
  if (isSelected(el)){
    removeElement(el);
  	selectElementContents();
  }
  else{
  	allSelectedElements.push(el);
  	selectElementContents();
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