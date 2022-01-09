const fetch = require('node-fetch');
const discord = require('discord.js');
const config = require('../config/config.json');
const client = new discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], 
    partials: ["CHANNEL"] //also needed for bot responding to DM's
});
let userID = config.discord_userID;
let tzAddress = config.tezos_address
let prefix = config.discord_prefix

client.on('ready', () => {
    console.log(client.user.tag + " has logged in.");
});


client.on("messageCreate", async message => {
    
    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(`${prefix}tzaddress`)) {
        const args = message.content.substring(prefix.length).split(/ +/);
        if (args.length < 2) { message.reply(`${prefix}${args[0]} is not a valid command!`) }
        tzAddress = args[1];
        message.reply(`Tezos address set to: https://tzkt.io/${tzAddress}/operations/`)
    }

    if (message.content.startsWith(`${prefix}userid`)) {
        const args = message.content.substring(prefix.length).split(/ +/);
        if (args.length < 2) { message.reply(`${prefix}${args[0]} is not a valid command!`) }
        userID = args[1];
        message.reply(`Discord userID set to: ${userID}`)
    }

    if (message.content === `${prefix}balance`) {
        const balance = await getBalance();
        client.users.fetch(userID, false).then((user) => {
            user.send(`Tezos address https://tzkt.io/${tzAddress}/operations/
Your current balance is: ${balance / 1e6} ꜩ`);
        });
    }
})

client.login(config.discord_token);

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

async function getBalance() {
    const response = await fetch(`https://api.tzkt.io/v1/accounts/${tzAddress}`);
    const account = await response.json();
    return account.balance;
}

async function notifierApp() {

    let lastBalance = -99999;
    setInterval(async function () {
        //  if there was no new block, we don't do anything.
        if (isNewBlock()) {
            // the request will be made no more than once a minute.
            const response = await fetch(`https://api.tzkt.io/v1/accounts/${tzAddress}`);
            const account = await response.json();

            if (account.balance != lastBalance) {

                let addorextract = (account.balance - lastBalance > 0) ? `⬆️` : `⬇️`;
                let text = `Tezos address https://tzkt.io/${tzAddress}/operations/\n
${addorextract}  Balance changed: ${(account.balance - lastBalance) / 1e6} ꜩ

Current balance: ${account.balance / 1e6} ꜩ
Previous balance: ${lastBalance / 1e6} ꜩ
                `;

                if (lastBalance != -99999) {
                    console.log(text);
                    client.users.fetch(userID, false).then((user) => {
                        user.send(text);
                    });
                }

                lastBalance = account.balance;

            }
        }
    }, 60000);
}

notifierApp();