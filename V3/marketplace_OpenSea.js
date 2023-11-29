// */-*/-*/-*/-MESSAGES FROM POPUP section
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'insertDataIntoOpenSeaLevels') {
        chrome.storage.local.get('annotations', (data) => {
            if (data.annotations) {
                const gcpResponse = data.annotations;
                //penSeaLevels(gcpResponse) need to be executed 2 times, dont know why 
                openSeaLevels(gcpResponse);
                openSeaLevels(gcpResponse);
            } else {
                console.error('insertDataIntoOpenSeaLevels No annotations found in storage');
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'insertDataIntoOpenSeaStats') {
        chrome.storage.local.get('gcpResponse', (data) => {
            console.log(data);
            if (data.gcpResponse.imagePropertiesAnnotation) {
                //openSeaStats(gcpResponse) need to be executed 2 times, dont know why 
                openSeaStats(data.gcpResponse)
                openSeaStats(data.gcpResponse)
            } else {
                console.error('insertDataIntoOpenSeaStats No annotations found in storage');
            }
        });
    }
});

//11/13/23
// marketplaces = ['https://opensea.io/', 'https://studio.manifold.xyz/']

// const observer = new MutationObserver((mutations) => {

//     for (const mutation of mutations) {
//         if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
//             for (const node of mutation.addedNodes) {
//                 console.log("Hey")
//                 console.log(node)
//                 //console.log(node.querySelectorAll("IMG"))
//                 console.log("Hey2")
//                 console.log(node.querySelectorAll("IMG")[0])
//                 myImage = node.querySelectorAll("IMG")[0]
//                 console.log('hey3 - testing')
//                 //alert(myImage)
//                 console.log(myImage)

//                 //const alt = img.alt;
//                 if (node.url && node.url.startsWith('blob:')) {
//                     // Check the image's source URL and update the context menu visibility
//                     const src = node.src;
//                     console.log(node)
//                     console.log("Travis Scot was!")
//                     console.log(src)
//                     if (marketplaces.some(url => src.startsWith(url))) {
//                         chrome.contextMenus.update("annotateImage", { visible: true });
//                     }
//                 }
//             }
//         }
//     }
// });

//11/13/23
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
                // Check if the node is an Element and contains an image
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const images = node.querySelectorAll("img");
                    if (images.length > 0) {
                        const myImage = images[0]; // Get the first image
                        //console.log('Image found:', myImage);

                        // Now you can safely access the src attribute
                        if (myImage.src.startsWith('blob:')) {
                            console.log('Blob URL:', myImage.src);
                            chrome.runtime.sendMessage({type: "blobUrlFound", blobUrl: myImage.src});
                            // Your additional logic here
                        }
                    }
                }
            }
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});



//11/13/23
// document.addEventListener('DOMContentLoaded', function() {
//     console.log("Enrique Gamboa");
//     // Your code to attach the event listener goes here
//     var fileInput = document.getElementById('media');
//     if (fileInput) {
//         fileInput.addEventListener('change', function(event) {
//             if (this.files && this.files[0]) {
//                 var blobUrl = URL.createObjectURL(this.files[0]);
//                 console.log(blobUrl); // Logs the blob URL

//                 // If you want to read the file as well
//                 var reader = new FileReader();
//                 reader.onload = function(e) {
//                     console.log(e.target.result); // Logs the base64 image data
//                 };
//                 reader.readAsDataURL(this.files[0]);
//             }
//         });
//     } else {
//         console.error('File input element not found');
//     }
// });


//11/13/23

// console.log("Enrique Gamboa");
// document.getElementById('media').addEventListener('change', function(event) {
//     console.log("Enrique Gamboa");
//     if (this.files && this.files[0]) {
//         var blobUrl = URL.createObjectURL(this.files[0]);
//         console.log(blobUrl); // This will log the blob URL
//         // You can also use this blob URL to display the image in an <img> tag
//     }
// });

// document.getElementById('media').addEventListener('change', function(event) {
//     console.log("Enrique Gamboa");
//     if (this.files && this.files[0]) {
//         var uploadedFile = this.files[0];
//         // You can now use this file object as needed
//         // For instance, read the file using FileReader to display its content
//         var reader = new FileReader();
//         reader.onload = function(e) {
//             // e.target.result will contain the base64 encoded image data
//             console.log(e.target.result);
//         };
//         reader.readAsDataURL(uploadedFile);
//     }
// });



//a

//11/12/2023 thgis is the closest aproach so far

//marketplaces = ['https://opensea.io/', 'https://studio.manifold.xyz/']

//Observer approach - 11/13/2023 - :( DID NOT WORKED)
// const observer = new MutationObserver((mutations) => {

//     for (const mutation of mutations) {
//         if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
//             for (const node of mutation.addedNodes) {
//                 console.log("Hey")
//                 console.log(node)
//                 //console.log(node.querySelectorAll("IMG"))
//                 console.log("Hey2")
//                 console.log(node.querySelectorAll("IMG")[0])
//                 myImage = node.querySelectorAll("IMG")[0]
//                 console.log('hey3 - testing')
//                 myImage = document.querySelector('img.sc-20c7dc01-0 brTeqa');
//                 console.log(myImage)

//                 //const alt = img.alt;
//                 if (node.url && node.url.startsWith('blob:')) {
//                     // Check the image's source URL and update the context menu visibility
//                     const src = node.src;
//                     console.log(node)
//                     console.log("Travis Scot was!")
//                     console.log(src)
//                     if (marketplaces.some(url => src.startsWith(url))) {
//                         chrome.contextMenus.update("annotateImage", { visible: true });
//                     }
//                 }
//             }
//         }
//     }
// });

// observer.observe(document.body, {
//     childList: true,
//     subtree: true
// });


//11/13/23
// Listen for changes in the file input element
//document.getElementById('media').addEventListener('change', function(e) {
// document.getElementById("media").addEventListener('change', function(e) {    
    
//     // Check if files are selected
//     if (this.files && this.files[0]) {
//         // Create a blob URL
//         var blobUrl = URL.createObjectURL(this.files[0]);
        
//         // Send this blob URL to the background script
//         chrome.runtime.sendMessage({ blobUrl: blobUrl });
//     }
// });




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

//a

function openSeaLevels(gcpResponse) {
    console.log('openSeaLevels');
    try {
        var t = document.querySelector('table');
        var htmlTableList = t.getElementsByTagName("tr");
        var noOfRowsOnTableClient = (htmlTableList.length) - 1;

        for (var i = 0; i < noOfRowsOnTableClient; i++) {
            typeIvalue = gcpResponse[i].description;
            nameIvalue = gcpResponse[i].score;
            htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').value = typeIvalue;
            htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').dispatchEvent(new Event('input', {
                'bubbles': true
            }))
            htmlTableList[i + 1].querySelector('input[placeholder="Min"]').value = parseInt(nameIvalue * 100);
            htmlTableList[i + 1].querySelector('input[placeholder="Min"]').dispatchEvent(new Event('input', {
                'bubbles': true
            }))
            htmlTableList[i + 1].querySelector('input[placeholder="Max"]').value = 100
            htmlTableList[i + 1].querySelector('input[placeholder="Max"]').dispatchEvent(new Event('input', {
                'bubbles': true
            }))
        };
        console.log('openSeaLevels data injected in opensea field');
    } catch (error) {
        console.log(error)
    }
}

//Inject GCP response into OpenSea stats
function openSeaStats(gcpResponse) {
    console.log('openSeaStats');
    try {
        var t = document.querySelector('table');
        var htmlTableList = t.getElementsByTagName("tr");
        var noOfRowsOnTableClient = (htmlTableList.length) - 1;

        var colorList = [];
        percentageList = [];
        sumColorScores = 0;
        for (var i = 0; i < noOfRowsOnTableClient; i++) {
            sumColorScores = sumColorScores + gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].score;
        }
        for (var i = 0; i < noOfRowsOnTableClient; i++) {
            perc = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].score / sumColorScores;
            percentageList.push(perc);
        }

        for (var i = 0; i < noOfRowsOnTableClient; i++) {
            typeIvalue = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i];
            myR = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.red;
            myG = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.green;
            myB = gcpResponse.imagePropertiesAnnotation.dominantColors.colors[i].color.blue;
            hexColor = rgbToHex(myR, myG, myB);

            nameIvalue = gcpResponse.labelAnnotations[i].score;

            htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').value = hexColor;//"PUTOS";request.type;
            htmlTableList[i + 1].querySelector('input[placeholder="Speed"]').dispatchEvent(new Event('input', {
                'bubbles': true
            }))
            htmlTableList[i + 1].querySelector('input[placeholder="Min"]').value = parseInt(percentageList[i] * 100);//request.name;
            htmlTableList[i + 1].querySelector('input[placeholder="Min"]').dispatchEvent(new Event('input', {
                'bubbles': true
            }))
            htmlTableList[i + 1].querySelector('input[placeholder="Max"]').value = 100
            htmlTableList[i + 1].querySelector('input[placeholder="Max"]').dispatchEvent(new Event('input', {
                'bubbles': true
            }))
            console.log('hey! printing values: ' + i);
            console.log(typeIvalue);
            console.log(nameIvalue)
        };
    } catch (error) {
        console.log(error)
    }
}

//Part of 'openSeaStats' 
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

//Part of 'openSeaStats' 
function rgbToHex(r, g, b) {
    //console.log("#" + componentToHex(r) + componentToHex(g) + componentToHex(b))
    return "colorRatio:#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}