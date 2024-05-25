const extpay = ExtPay('test2');

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
    } else {
        if (user.paid) {
            document.querySelector('#user-message').innerHTML = 'User has paid ✅';
            document.querySelector('button').remove();
            document.querySelector('#user-message-licence-info').remove();
            document.getElementById('image-upload-section').style.display = 'block';
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
            saveImageToStorage(imageDataUrl);
        };
        reader.readAsDataURL(file);
    }
});

function saveImageToStorage(imageDataUrl) {
    chrome.storage.local.set({ uploadedImage: imageDataUrl }, function () {
        console.log('Image saved to storage.');
    });
}

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

document.getElementById('get-properties-button').addEventListener('click', function () {
    const imageUrl = document.getElementById('uploaded-image').src;
    if (imageUrl) {
        document.getElementById('api-loading').style.display = 'block';
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
            document.getElementById('api-loading').style.display = 'none';
            document.getElementById('api-results').style.display = 'block';
            displayResults(data);
        })
        .catch(error => {
            document.getElementById('api-results').innerHTML = error;
            console.error('Error:', error); 
        });
    }
});

function displayResults(data) {
    document.getElementById('nft-title').innerText = data.Title;
    document.getElementById('copy-title').style.display = 'block';
    document.getElementById('nft-description').innerText = data.Description;
    document.getElementById('copy-description').style.display = 'block';
    
    const traitsTable = document.getElementById('traits-table');
    traitsTable.innerHTML = '';
    data.Traits.slice(0, 3).forEach(trait => {
        const row = traitsTable.insertRow();
        const traitTypeCell = row.insertCell(0);
        const valueCell = row.insertCell(1);
        const copyCell = row.insertCell(2);

        traitTypeCell.innerText = trait.Trait_type;
        valueCell.innerText = trait.Value;

        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy';
        copyButton.addEventListener('click', () => {
            copyToClipboard(`${trait.Trait_type}: ${trait.Value}`);
        });
        copyCell.appendChild(copyButton);
    });

    document.getElementById('show-more').addEventListener('click', function () {
        traitsTable.innerHTML = '';
        data.Traits.forEach(trait => {
            const row = traitsTable.insertRow();
            const traitTypeCell = row.insertCell(0);
            const valueCell = row.insertCell(1);
            const copyCell = row.insertCell(2);

            traitTypeCell.innerText = trait.Trait_type;
            valueCell.innerText = trait.Value;

            const copyButton = document.createElement('button');
            copyButton.innerText = 'Copy';
            copyButton.addEventListener('click', () => {
                copyToClipboard(`${trait.Trait_type}: ${trait.Value}`);
            });
            copyCell.appendChild(copyButton);
        });
        document.getElementById('show-more').style.display = 'none';
        document.getElementById('show-less').style.display = 'block';
    });

    document.getElementById('show-less').addEventListener('click', function () {
        traitsTable.innerHTML = '';
        data.Traits.slice(0, 3).forEach(trait => {
            const row = traitsTable.insertRow();
            const traitTypeCell = row.insertCell(0);
            const valueCell = row.insertCell(1);
            const copyCell = row.insertCell(2);

            traitTypeCell.innerText = trait.Trait_type;
            valueCell.innerText = trait.Value;

            const copyButton = document.createElement('button');
            copyButton.innerText = 'Copy';
            copyButton.addEventListener('click', () => {
                copyToClipboard(`${trait.Trait_type}: ${trait.Value}`);
            });
            copyCell.appendChild(copyButton);
        });
        document.getElementById('show-more').style.display = 'block';
        document.getElementById('show-less').style.display = 'none';
    });
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
