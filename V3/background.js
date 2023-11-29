importScripts('ExtPay.js')

// To test payments, replace 'sample-extension' with the ID of
// the extension you registered on ExtensionPay.com. You may
// need to uninstall and reinstall the extension.
// And don't forget to change the ID in popup.js too!
var extpay = ExtPay('nft-trait-generator');
extpay.startBackground(); // this line is required to use ExtPay in the rest of your extension

extpay.getUser().then(user => {
  console.log(user)
})


// END TEMPLATE

let imageUrl = null;

//marketplaces = ['https://opensea.io/', 'https://studio.manifold.xyz/']
marketplaces = ['https://studio.manifold.xyz/']

chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("welcome/hello.html");
  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);
  chrome.contextMenus.create({
    id: "annotateImage",
    title: "NFT trait generator",
    contexts: ["image"],
    visible: true
    //visible: false // initially make it invisible
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("annotateImage listener")
  if (info.menuItemId === "annotateImage") {
    imageUrl = info.srcUrl;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("getImageUrl listener")
  //11/13/23
  // var mydatURL
  // if (request.type === "blobUrlFound") {
  //   console.log('Received Blob URL:', "blob:" + request.blobUrl);
  //   const blob = new Blob([request.blobUrl], { type: 'image/png' });
  //   const reader = new FileReader();
  //   reader.readAsDataURL(blob);
  //   reader.onload = function (event) {
  //     const dataURL = event.target.result;
  //     console.log(dataURL);
  //     sendResponse({ imageUrl: dataURL });
  //     // Now you have the Data URL, which you can send to the external API
  //   };
  // console.log(mydatURL);

  // }
  if (request.type === "blobUrlFound") {
    console.log("KIKE");
  };

  if (request.type === "getImageUrl") {
    sendResponse({ imageUrl: imageUrl });
  }



});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url.startsWith(marketplaces[0]) || tab.url.startsWith(marketplaces[1])) {
    chrome.contextMenus.update("annotateImage", { visible: true });
  } else {
    chrome.contextMenus.update("annotateImage", { visible: false });
  }
});

