const extpay = ExtPay('test2')

console.log('sidepanel.js');

document.querySelector('#pay-now').addEventListener('click', function () {
    extpay.openPaymentPage();
});

extpay.getUser().then(user => {
    if (user.paid == false) {
        document.querySelector('#pay-now').addEventListener('click', extpay.openTrialPage())
    }
    const now = new Date();
    const elevenMinutes = 11 * 60 * 1000
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
