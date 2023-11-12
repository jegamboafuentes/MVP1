chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'insertDataIntoManifold1') {
      chrome.storage.local.get('gcpResponse', (data) => {
        if (data.gcpResponse.imagePropertiesAnnotation) {
          manifold1Data(data.gcpResponse)
        } else {
          console.error('insertDataIntoManifold1 No annotations found in storage');
        }
      });
    }
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'insertDataIntoManifold2') {
      chrome.storage.local.get('gcpResponse', (data) => {
        if (data.gcpResponse.imagePropertiesAnnotation) {
          manifold2Data(data.gcpResponse)
        } else {
          console.error('insertDataIntoManifold2 No annotations found in storage');
        }
      });
    }
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'insertDataIntoManifold3') {
      chrome.storage.local.get('gcpResponse', (data) => {
        if (data.gcpResponse.imagePropertiesAnnotation) {
          manifold3Data(data.gcpResponse)
        } else {
          console.error('insertDataIntoManifold3 No annotations found in storage');
        }
      });
    }
  });

  function manifold1Data(dataFromGCP) {
    console.log("manifold1Data");
    console.log(dataFromGCP);
    bigListDescription = getBigTraitList(dataFromGCP);
    //bigListValue = []
    //getBigTraitList(dataFromGCP);
    console.log('manifold1Data after combining data');
    console.log(bigListDescription.bigListDescription);
  
    //this just changes the front end
    try {
      var t = document.getElementById("property-list");
      var htmlTableList = t.getElementsByClassName("flex items-center py-2 border-b-2 list-el");
  
      nfieldsUsed = 0;
  
      //This for counts the spaces used 
      for (var i = 0; i < htmlTableList.length; i++) {
        let propertyNameInput = htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]');
        if (htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value) {
          nfieldsUsed = nfieldsUsed + 1;
        } else {
          htmlTableList[i].querySelector('input[placeholder="PROPERTY NAME"]').value = bigListDescription.bigListDescription[i]//'YO!';
          triggerEvent(propertyNameInput, 'blur');
        }
  
      }
      nfieldsFree = (htmlTableList.length - nfieldsUsed)
      console.log('field used' + nfieldsUsed);
      console.log('field free' + nfieldsFree);
  
  
    } catch (error) {
      console.log(error)
    }
  }
  
  function manifold2Data(dataFromGCP) {
    console.log("manifold2Data");
    console.log(dataFromGCP);
    bigListDescription = getBigTraitList(dataFromGCP);
    console.log('manifold2Data after combining data');
    console.log(bigListDescription.bigListValue);
    //this just changes the front end
    try {
      var t = document.getElementById("property-list");
      var htmlTableList = t.getElementsByClassName("flex items-center py-2 border-b-2 list-el");
  
      nfieldsUsed = 0;
  
      //This for counts the spaces used 
      for (var i = 0; i < htmlTableList.length; i++) {
        let propertyNameInput = htmlTableList[i].querySelector('input[placeholder="Value"]');
        if (htmlTableList[i].querySelector('input[placeholder="Value"]').value) {
          nfieldsUsed = nfieldsUsed + 1;
        } else {
          htmlTableList[i].querySelector('input[placeholder="Value"]').value = bigListDescription.bigListValue[i]//'YO!';
          triggerEvent(propertyNameInput, 'blur');
        }
  
      }
      nfieldsFree = (htmlTableList.length - nfieldsUsed)
      console.log('field used' + nfieldsUsed);
      console.log('field free' + nfieldsFree);
  
  
    } catch (error) {
      console.log(error)
    }
  }
  
  function manifold3Data(dataFromGCP) {
    console.log("manifold3Data");
    const myMax = 100;
    nfieldsUsed = 0;
    try {
      var t = document.getElementById("property-list");
      var htmlTableList = t.getElementsByClassName("w-full flex justify-between items-center");
      console.log(htmlTableList);
      //console.log(htmlTableList[3].querySelector('input[placeholder="Max Value"]'));
      for (var i = 0; i < htmlTableList.length; i++) {
        let maxField = htmlTableList[i].querySelector('input[placeholder="Max Value"]');
        console.log(maxField);
        if (maxField) {
          maxField.value = 100;
          triggerEvent(maxField, 'blur');
        }
        //maxField.value = 100;
      }
  
      // for (var i = 0; i < htmlTableList.length; i++) {
      //   console.log(htmlTableList[i].querySelector('input[placeholder="Max Value"]'));
      //   htmlTableList[i].querySelector('input[placeholder="Value"]').value;
      //   triggerEvent(propertyNameInput, 'blur');
      //   console.log(htmlTableList[i].querySelector('input[placeholder="Max Value"]'));
  
      // }
  
    } catch (error) {
      console.log("error: " + error);
    }
  }
  
  //part of manifold1Data
  function triggerEvent(element, eventName) {
    const event = new Event(eventName, { bubbles: true });
    element.dispatchEvent(event);
  }
  
  //part of manifold1Data
  function getBigTraitList(gcpResponse) {
    console.log("getBigTraitList");
    bigListDescription = [];
    bigListValue = [];
  
    myAnnotationList = functionGetResponseAnnotation(gcpResponse);
    myAnnotaationColor = functionGetResponseColors(gcpResponse).responseColorList;
    myAnnotaationColorValue = functionGetResponseColors(gcpResponse).percentageList;
  
    console.log("RETURN bigListDescription: ")
    //console.log(myAnnotaationColor);
    //console.log(myAnnotaationColorValue);
    for (let i = 0; i < myAnnotationList.length; i++) {
      bigListDescription.push(myAnnotationList[i].description);
      bigListValue.push((myAnnotationList[i].score * 100).toFixed(2));
    }
    //console.log(myAnnotaationColor);
    for (let i = 0; i < myAnnotaationColor.length; i++) {
      bigListDescription.push(myAnnotaationColor[i]);
    }
    for (let i = 0; i < myAnnotaationColorValue.length; i++) {
      bigListValue.push(myAnnotaationColorValue[i]);
    }
    //4/3/23 work
    // bigListDescription.push("Artist");
    // bigListDescription.push("AI_MODEL");
    // bigListDescription.push("LENGTH");
    // bigListDescription.push("WIDTH");
    // bigListValue.push("metaverse_professional");
    // bigListValue.push("Midjourney V5");
    // bigListValue.push("4096");
    // bigListValue.push("4096");
    
  
  
    return {
      bigListDescription,
      bigListValue
    };
  
  }
  
  function functionGetResponseAnnotation(gcpResponse) {
    console.log("functionGetResponseAnnotation");
    //console.log(gcpResponse.labelAnnotations);
    responseAnnotationList = gcpResponse.labelAnnotations;
    return responseAnnotationList;
  }
  
  function functionGetResponseColors(gcpResponse) {
    console.log("functionGetResponseColors");
    console.log(gcpResponse);
    responseColorList = []
    for (var i = 0; i < gcpResponse.imagePropertiesAnnotation.dominantColors.colors.length; i++) {
      myR = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.red;
      myG = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.green;
      myB = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.blue;
      responseColorList.push(hexColor = rgbToHex(myR, myG, myB));
    };
  
    percentageList = [];
    sumColorScores = 0;
    for (var i = 0; i < gcpResponse.imagePropertiesAnnotation.dominantColors.colors.length; i++) {
      sumColorScores = sumColorScores + gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].score;
    }
    for (var i = 0; i < gcpResponse.imagePropertiesAnnotation.dominantColors.colors.length; i++) {
      perc = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].score / sumColorScores;
      percentageList.push(((perc) * 100).toFixed(2));
    }
  
    return { responseColorList, percentageList };
  }