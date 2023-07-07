const button = document.getElementById("button");

const text = document.getElementById("text");
const img = document.getElementById("img");
const doneText = document.getElementById("alldone");

var moduleList = []

function pushErrorList(element){
  errorList.push(element);
}

button.addEventListener("click", () => {
  var textArea = text.value.split("\n");
  textArea.forEach(element => {
    if(element != ''){
        element = element.trim();
        if(element == 'YesNo'){
            element = 'Yes/No'
        }
        if(element == 'CMMS Fulfilment Status'){
            element = 'CMMS Fulfillment Status'
        }
        moduleList.push(element);
        injectCode(element, 1);
    }
  });
  // img.style.display = "block"
  doneText.style.display = "contents"
  injectCode('CMMS Manual T&M Column', 2);
  injectCode('CMMS Config UE', 1);
});

function updateHTML(element, fieldValue) {
        try {
            var xpath = "//td[text()='" + element + "']";
            var matchingElement = document.evaluate(
              xpath,
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );
            var snapshotLength = matchingElement.snapshotLength;
            if(snapshotLength == 0){
              throw "Did not find: "+element;
            }
            for (let index = 0; index < snapshotLength; index++) {
                var nodeElement = matchingElement.snapshotItem(index);
                var found = false;
                try {
                    var parentElement = nodeElement.parentNode;
                    var testField = parentElement.getElementsByClassName("input");
                    var selectField = testField[0];
                    selectField.selectedIndex = fieldValue;
                    found = true;
                } catch (error) {
                }

            }
            if(!found){
              console.error("Did not find: "+element);}
            
          } catch (error) {
            console.error(error);
          }
  }

function injectCode(module, fieldValue) {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) return;
    chrome.scripting
    .executeScript({
      target : {tabId : tab.id},
      func : updateHTML,
      args : [module, fieldValue]
    })
    .then(() => console.log("injected a function"));
  });
}
