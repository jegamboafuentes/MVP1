// Replace 'sample-extension' with the id of the extension you
// registered on ExtensionPay.com to test payments. You may need to
// uninstall and reinstall the extension to make it work.
// Don't forget to change the ID in background.js too!
const extpay = ExtPay('test2')

document.querySelector('#pay-now').addEventListener('click', function () {
    extpay.openPaymentPage();
});

extpay.getUser().then(user => {
    if (user.paid == false) {
        document.querySelector('#pay-now').addEventListener('click', extpay.openTrialPage())
    }
    const now = new Date();
    //const sevenDays = 1000*60*60*24*7 // in milliseconds
    //const thirtySeconds = 30 * 1000  //# in milliseconds
    const elevenMinutes = 11 * 60 * 1000
    //const threeMinutes = 3 * 60 * 1000
    if (user.trialStartedAt && (now - user.trialStartedAt) < elevenMinutes) {
        const remainingTimeInMinutes = (elevenMinutes - (now - user.trialStartedAt)) / 60000
        document.querySelector('#user-message').innerHTML = `trial active, remaining time ⌛ ${remainingTimeInMinutes.toFixed(2)} minutes`
        document.querySelector('button').remove()
        // user's trial is active
    } else {
        // user's trial is not active
        if (user.paid) {
            document.querySelector('#user-message').innerHTML = 'User has paid ✅'
            document.querySelector('button').remove()
        } else if (user.trialStartedAt == null) {
            document.querySelector('#user-message').innerHTML = 'User has not started a trial yet.'
        }
        else {
            document.querySelector('#user-message').innerHTML = 'Trial ended 🫥, please pay to continue using this extension.'
        }
    }
}).catch(err => {
    document.querySelector('#user-message').innerHTML = "Error fetching data :( Check that your ExtensionPay id is correct and you're connected to the internet"
})

// extpay.onPaid(function() { console.log('popup paid')});

//END TEMPLATE 

const apiKey = "AIzaSyDUYrOx0r7spBBltBDthXu_zwWzk2LKUA4";
const annotationsContainer = document.getElementById("annotations");
const statusElement = document.getElementById("status-text");

chrome.runtime.sendMessage({ type: "getImageUrl" }, (response) => {
    if (response.imageUrl) {
        setStatus(2, response.imageUrl); // Image loaded

        annotateImage(response.imageUrl)
            .then((annotations) => {
                if (annotations.labelAnnotations && annotations.labelAnnotations.length > 0) {
                    setStatus(4, response.imageUrl); // Displaying results
                } else {
                    setStatus(3); // Waiting
                }

                // Save annotations to chrome.storage.local
                chrome.storage.local.set({ annotations: annotations.labelAnnotations });
                // console.log('gcpResponse +++++ chrome.runtime.sendMessage({ type: "getImageUrl" }');
                // console.log(annotations);
                chrome.storage.local.set({ gcpResponse: annotations });

                displayAnnotations(annotations.labelAnnotations);
            })
            .catch((error) => {
                console.error(error);
                annotationsContainer.innerHTML = "Error: Failed to fetch annotations.";
            });
    } else {
        setStatus(1); // Image not loaded
    }
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        const openseaSection = document.getElementById('opensea-section');
        const manifoldSection = document.getElementById('manifold-section');

        const disableButtonsInSection = (sectionElement) => {
            const buttons = sectionElement.getElementsByTagName('button');
            for(let button of buttons){
                button.disabled = true;
            }
        };

        extpay.getUser().then(user => {
            if (user.paid) {
                if (url.startsWith('https://opensea.io/')) {
                    openseaSection.style.display = 'block';
                    manifoldSection.style.display = 'none';
                } else if (url.startsWith('https://studio.manifold.xyz/')) {
                    manifoldSection.style.display = 'block';
                    openseaSection.style.display = 'none';
                } else {
                    openseaSection.style.display = 'none';
                    manifoldSection.style.display = 'none';
                }
            } else {
                openseaSection.style.display = 'none';
                manifoldSection.style.display = 'none';
                // document.querySelector('#status-payment').innerHTML = '👩‍🚀 Pay one time fee to use Extension';
                // If you want to disable buttons when the user didn't pay, uncomment the lines below
                //disableButtonsInSection(openseaSection);
                //disableButtonsInSection(manifoldSection);
            }
        });
    });
});

function generateThumbnail(imageUrl, width, height) {
    const cloudName = 'dqazeznld'; // Replace with your Cloudinary cloud name
    const encodedImageUrl = encodeURIComponent(imageUrl);
    const transformation = `w_${width},h_${height},c_fill`;

    return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformation}/${encodedImageUrl}`;
}

async function annotateImage(imageUrl) {
    console.log('IN GCP VISON REST CALL FUNCTION')
    console.log('original image to analyze: ' + imageUrl)
    imageUrl = generateThumbnail(imageUrl, 500, 500);
    console.log('new image to analyze: ' + imageUrl)
    const apiEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const requestBody = {
        requests: [
            {
                image: {
                    source: {
                        imageUri: imageUrl,
                    },
                },
                features: [
                    {
                        type: "LABEL_DETECTION",
                        maxResults: 11,
                    },
                    {
                        type: "IMAGE_PROPERTIES",
                        maxResults: 20,
                    },
                ],
            },
        ],
    };

    let retries = 50;
    let annotations;
    let gcpApiVisionResponse;

    while (retries > 0) {
        console.log('in while')
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('debuging');
        gcpApiVisionResponse = data.responses[0];
        annotations = data.responses[0].labelAnnotations;



        if (annotations && annotations.length > 0) {
            break;
        } else {
            retries--;
            if (retries > 0) {
                setStatus(3); // Waiting
            }
        }
    }

    return gcpApiVisionResponse;
}

function displayAnnotations(annotations) {
    // ... (Existing code)

    if (annotations && annotations.length > 0) {
        const list = document.createElement("ul");
        annotations.slice(0, 5).forEach((annotation) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${annotation.description} (${(annotation.score * 100).toFixed(2)}%)`;
            list.appendChild(listItem);
        });
        annotationsContainer.appendChild(list);
    } else {
        annotationsContainer.innerHTML = "No annotations found.";
    }

    const actionsContainer = document.getElementById("actions");
    actionsContainer.style.display = "block";
}

function setStatus(status, img) {
    const statusImage = document.getElementById("status-image");

    switch (status) {
        case 1:
            statusElement.textContent = "🤖: Image not loaded";
            statusImage.src = "img/project.png";
            break;
        case 2:
            statusElement.textContent = "Processing this image:";
            statusImage.src = img;
            break;
        case 3:
            statusElement.textContent = "🤖: Waiting (this can take a minute)";
            statusImage.src = "img/pixel5.png";
            break;
        case 4:
            statusElement.textContent = "traits (sample(5)):";
            statusImage.src = img;
            break;
        default:
            statusElement.textContent = "🤖: Unknown";
            statusImage.src = img//"images/unknown.png";
    }
}

document.getElementById('openSeaLevels_button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoOpenSeaLevels' });
    });
});

document.getElementById('openSeaStats_button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoOpenSeaStats' });
    });
});


document.getElementById('manifold_button1').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoManifold1' });
    });
});

document.getElementById('manifold_button2').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoManifold2' });
    });
});

document.getElementById('manifold_button3').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'insertDataIntoManifold3' });
    });
});