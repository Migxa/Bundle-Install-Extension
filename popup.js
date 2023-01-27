const button = document.getElementById("button");

const text = document.getElementById("text");
const img = document.getElementById("img");
const doneText = document.getElementById("alldone");

var moduleList = []

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
    console.log("Updated: "+element);
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
            for (let index = 0; index < snapshotLength; index++) {
                var nodeElement = matchingElement.snapshotItem(index);
                try {
                    var parentElement = nodeElement.parentNode;
                    var testField = parentElement.getElementsByClassName("input");
                    var selectField = testField[0];
                    selectField.selectedIndex = fieldValue;
                } catch (error) {
                    
                }
            }
            
          } catch (error) {
            console.error(error, element);
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
