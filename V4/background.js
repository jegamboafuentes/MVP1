importScripts('ExtPay.js')

// To test payments, replace 'sample-extension' with the ID of
// the extension you registered on ExtensionPay.com. You may
// need to uninstall and reinstall the extension.
// And don't forget to change the ID in popup.js too!
var extpay = ExtPay('test2'); 
extpay.startBackground(); // this line is required to use ExtPay in the rest of your extension

extpay.getUser().then(user => {
	console.log(user)
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onInstalled.addListener(async () => {
    //let url = chrome.runtime.getURL("welcome/hello.html");
    let url = "https://metaverseprofessional.tech/pages/chrome-extensions";
    let tab = await chrome.tabs.create({ url });
    console.log(`Created tab ${tab.id}`);
});