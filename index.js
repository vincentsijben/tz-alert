// https://baking-bad.org/blog/2020/07/29/tezos-explorer-api-tzkt-how-often-to-make-requests/#how-often-do-i-need-to-make-api-requests
const fetch = require('node-fetch');
require('dotenv').config()
const nodemailer = require("nodemailer");
// for email read https://nodemailer.com/usage/using-gmail/
// and create an app-password for gmail https://security.google.com/settings/security/apppasswords
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

let address = process.env.TZ_ADDRESS

let localHead = null;
let nextBlockTime = Date.now()

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

async function isNewBlock() {
    if (Date.now() >= nextBlockTime) {
        const response = await fetch('https://api.tzkt.io/v1/head');
        const remoteHead = await response.json();
        
        if (localHead == null || remoteHead.level != localHead.level) {
            localHead = remoteHead;
            nextBlockTime = addMinutes(new Date(remoteHead.timestamp), 1);
            return true;
        }
    }
    return false;
}

async function notifierApp() {

    var lastBalance = -1;
    setInterval(async function () {
        //  if there was no new block, we don't do anything.
        if (isNewBlock()) {
            // the request will be made no more than once a minute.

            const response = await fetch(`https://api.tzkt.io/v1/accounts/${address}`);
            const account = await response.json();
            //console.log(account);

            if (account.balance != lastBalance) {
                //    sendNotification("Balance has been changed!");
                let text = "Balance has been changed!\n";
                
                console.log("Balance has been changed!");
                if (account.balance-lastBalance>0) {
                    console.log(`⬆️ ${(account.balance-lastBalance)/1e6}ꜩ added`);
                    text += `⬆️ ${(account.balance-lastBalance)/1e6}ꜩ added\n`
                } else {
                    console.log(`⬇️ ${(lastBalance-account.balance)/1e6}ꜩ extracted`);
                    text += `⬆️ ${(account.balance-lastBalance)/1e6}ꜩ added\n`
                }
                console.log(`Current balance: ${account.balance/1e6}ꜩ`);
                console.log(`Previous balance: ${lastBalance}`);
                text += `Current balance: ${account.balance/1e6}ꜩ\n`;
                text += `Previous balance: ${lastBalance/1e6}`


                let mailOptions = {
                    from: process.env.MAIL_FROM,
                    to: process.env.MAIL_TO,
                    subject: `Change in ꜩ balance`,
                    text: `Hi! There was a change in your ꜩ balance:\n\n${text}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) console.log(error);
                    else console.log('Email sent: ' + info.response);
                });


                lastBalance = account.balance;
            }
        }
    }, 5000);
}

notifierApp();