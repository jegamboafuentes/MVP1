const extpay = ExtPay('test2');

console.log('sidepanel.js');

document.querySelector('#pay-now').addEventListener('click', function () {
    extpay.openPaymentPage();
});

extpay.getUser().then(user => {
    if (user.paid == false) {
        document.querySelector('#pay-now').addEventListener('click', extpay.openTrialPage());
    }
    const now = new Date();
    const elevenMinutes = 11 * 60 * 1000;
    if (user.trialStartedAt && (now - user.trialStartedAt) < elevenMinutes) {
        const remainingTimeInMinutes = (elevenMinutes - (now - user.trialStartedAt)) / 60000;
        document.querySelector('#user-message').innerHTML = `trial active, remaining time ⌛ ${remainingTimeInMinutes.toFixed(2)} minutes`;
        document.querySelector('button').remove();
        // user's trial is active
    } else {
        // user's trial is not active
        if (user.paid) {
            document.querySelector('#user-message').innerHTML = 'User has paid ✅';
            document.querySelector('button').remove();
            document.querySelector('#user-message-licence-info').remove();
            // Show the image upload section
            document.getElementById('image-upload-section').style.display = 'block';
            // Load the stored image if any
            loadStoredImage();
        } else if (user.trialStartedAt == null) {
            document.querySelector('#user-message').innerHTML = 'User has not started a trial yet.';
        } else {
            document.querySelector('#user-message').innerHTML = 'Trial ended 🥵, please pay to continue using this extension.';
        }
    }
}).catch(err => {
    document.querySelector('#user-message').innerHTML = "Error fetching data :( Check that your ExtensionPay id is correct and you're connected to the internet";
});

// Handle image upload
document.getElementById('image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageDataUrl = e.target.result;
            document.getElementById('uploaded-image').src = imageDataUrl;
            document.getElementById('uploaded-image').style.display = 'block';
            document.getElementById('get-properties-button').style.display = 'block';
            document.getElementById('image-upload-label').style.display = 'none';
            // Save the image data to Chrome's storage
            saveImageToStorage(imageDataUrl);
        };
        reader.readAsDataURL(file);
    }
});

// Function to save the image data to Chrome's storage
function saveImageToStorage(imageDataUrl) {
    chrome.storage.local.set({ uploadedImage: imageDataUrl }, function () {
        console.log('Image saved to storage.');
    });
}

// Function to load the stored image from Chrome's storage
function loadStoredImage() {
    chrome.storage.local.get(['uploadedImage'], function (result) {
        if (result.uploadedImage) {
            document.getElementById('uploaded-image').src = result.uploadedImage;
            document.getElementById('uploaded-image').style.display = 'block';
            document.getElementById('get-properties-button').style.display = 'block';
            document.getElementById('image-upload-label').style.display = 'none';
        }
    });
}

// Handle Get Properties button click
document.getElementById('get-properties-button').addEventListener('click', function () {
    const imageUrl = document.getElementById('uploaded-image').src;
    if (imageUrl) {
        fetch('https://api1-dot-metaverseprofessionalapis.uk.r.appspot.com/generateNFTMetadata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: imageUrl,
                context: ""
            })
        })
        .then(response => response.json())
        .then(data => {
            // Display the API results
            document.getElementById('api-results').innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
