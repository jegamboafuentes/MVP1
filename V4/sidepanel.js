const extpay = ExtPay('test2');

// Event listener for the pay-now button
document.querySelector('#pay-now').addEventListener('click', function () {
    extpay.openPaymentPage();
});

// Fetch user data and handle the user state accordingly
extpay.getUser().then(user => {
    handleUserState(user);
}).catch(err => {
    displayErrorMessage("Error fetching data :( Check that your ExtensionPay id is correct and you're connected to the internet");
});

// Event listener for the image upload input
document.getElementById('image-upload').addEventListener('change', handleImageUpload);

// Event listener for fetching image properties
document.getElementById('get-properties-button').addEventListener('click', fetchImageProperties);

// Handle the user state based on their payment and trial status
function handleUserState(user) {
    if (!user.paid) {
        document.querySelector('#pay-now').addEventListener('click', extpay.openTrialPage());
    }

    const now = new Date();
    const elevenMinutes = 11 * 60 * 1000;
    if (user.trialStartedAt && (now - user.trialStartedAt) < elevenMinutes) {
        const remainingTimeInMinutes = (elevenMinutes - (now - user.trialStartedAt)) / 60000;
        displayMessage(`trial active, remaining time ⌛ ${remainingTimeInMinutes.toFixed(2)} minutes`);
        removeElement('button');
    } else if (user.paid) {
        displayMessage('User has paid ✅, 🙏');
        removeElement('button');
        removeElement('#user-message-licence-info');
        showElement('image-upload-section');
        loadStoredImage();
    } else if (!user.trialStartedAt) {
        displayMessage('User has not started a trial yet.');
    } else {
        displayMessage('Trial ended 🥵, please pay to continue using this extension.');
    }
}

// Handle the image upload process
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageDataUrl = e.target.result;
            displayUploadedImage(imageDataUrl);
            saveImageToStorage(imageDataUrl);
        };
        reader.readAsDataURL(file);
    }
}

// Save the uploaded image to local storage
function saveImageToStorage(imageDataUrl) {
    chrome.storage.local.set({ uploadedImage: imageDataUrl }, function () {
        console.log('Image saved to storage.');
    });
}

// Load the stored image from local storage
function loadStoredImage() {
    chrome.storage.local.get(['uploadedImage'], function (result) {
        if (result.uploadedImage) {
            displayUploadedImage(result.uploadedImage);
        }
    });
}

// Display the uploaded image on the page
function displayUploadedImage(imageDataUrl) {
    document.getElementById('uploaded-image').src = imageDataUrl;
    showElement('uploaded-image');
    showElement('get-properties-button');
    hideElement('image-upload-label');
}

// Fetch properties of the uploaded image
function fetchImageProperties() {
    const imageUrl = document.getElementById('uploaded-image').src;
    const context = document.getElementById('context-input').value; // Get the context input value
    if (imageUrl) {
        showElement('api-loading');
        fetch('https://api1-dot-metaverseprofessionalapis.uk.r.appspot.com/generateNFTMetadata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: imageUrl,
                context: context // Include the context in the request
            })
        })
        .then(response => response.json())
        .then(data => {
            hideElement('api-loading');
            showElement('api-results');
            displayResults(data);
        })
        .catch(error => {
            displayErrorMessage(error);
            console.error('Error:', error);
        });
    }
}


// Display the results of the image properties
function displayResults(data) {
    document.getElementById('nft-title').innerText = data.Title;
    showElement('copy-title');
    document.getElementById('nft-description').innerText = data.Description;
    showElement('copy-description');

    const traitsTable = document.getElementById('traits-table');
    traitsTable.innerHTML = '';
    data.Traits.slice(0, 3).forEach(trait => {
        appendTraitRow(traitsTable, trait);
    });

    addCopyButtonListeners('copy-title', 'nft-title');
    addCopyButtonListeners('copy-description', 'nft-description');

    document.getElementById('show-more').addEventListener('click', () => toggleTraitsDisplay(data.Traits, traitsTable, true));
    document.getElementById('show-less').addEventListener('click', () => toggleTraitsDisplay(data.Traits, traitsTable, false));
}

// Append a row with trait data to the traits table
function appendTraitRow(table, trait) {
    const row = table.insertRow();
    row.insertCell(0).innerText = trait.Trait_type;
    appendCopyButton(row.insertCell(1), trait.Trait_type);
    row.insertCell(2).innerText = trait.Value;
    appendCopyButton(row.insertCell(3), trait.Value);
    appendCopyButton2(row.insertCell(4), `${trait.Trait_type}: ${trait.Value}`);
    
}

// Append a copy button to a table cell
function appendCopyButton(cell, text) {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-copy"></i>';
    button.classList.add('icon-button');
    button.addEventListener('click', () => copyToClipboard(text));
    cell.appendChild(button);
}

// Append a copy button to a table cell
function appendCopyButton2(cell, text) {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-copy"></i> <i class="fas fa-copy"></i>';
    button.classList.add('icon-button');
    button.addEventListener('click', () => copyToClipboard(text));
    cell.appendChild(button);
}


// Toggle the display of traits between limited and full view
function toggleTraitsDisplay(traits, table, showAll) {
    table.innerHTML = '';
    const traitsToShow = showAll ? traits : traits.slice(0, 3);
    traitsToShow.forEach(trait => appendTraitRow(table, trait));
    toggleElementVisibility('show-more', !showAll);
    toggleElementVisibility('show-less', showAll);
}

// Copy text to the clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Display a message to the user
function displayMessage(message) {
    document.querySelector('#user-message').innerHTML = message;
}


// Display an error message to the user
function displayErrorMessage(errorMessage) {
    document.querySelector('#user-message').innerHTML = errorMessage;
}

// Show an element by its ID
function showElement(elementId) {
    document.getElementById(elementId).style.display = 'block';
}

// Hide an element by its ID
function hideElement(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

// Remove an element from the DOM by its selector
function removeElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.remove();
    }
}

// Add event listeners for copy buttons
function addCopyButtonListeners(buttonId, targetId) {
    document.getElementById(buttonId).addEventListener('click', function () {
        copyToClipboard(document.getElementById(targetId).innerText);
    });
}

// Toggle the visibility of an element by its ID
function toggleElementVisibility(elementId, isVisible) {
    document.getElementById(elementId).style.display = isVisible ? 'block' : 'none';
}
