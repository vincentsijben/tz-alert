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

let localHead = null;
let lastBalance = null;
let nextBlockTime = Date.now()

client.on('ready', () => {
    console.log(client.user.tag + " has logged in.");
});



client.on("messageCreate", async message => {

    if (message.author.bot) return; //don't want the bot to inception it's own messages

    if (!message.content.startsWith(prefix)) return; //don't do anything without the set prefix

    //change Tezos address
    if (message.content.startsWith(`${prefix}tzaddress`)) {

        const args = message.content.substring(prefix.length).split(/ +/);
        if (args.length < 2) return message.reply(`${prefix}${args[0]} is not a valid command. Usage: !tzaddress your-tz-address`);

        const response = await fetch(`https://api.tzkt.io/v1/accounts/${args[1]}`);
        const result = await response.json();
        if (result?.errors?.address) return message.reply(`${result.errors.address} Still using https://tzkt.io/${tzAddress}/`);
        tzAddress = args[1];

        //set new Balance:
        const responseBalance = await fetch(`https://api.tzkt.io/v1/accounts/${tzAddress}/balance`);
        const balance = await responseBalance.json();
        lastBalance = balance;

        client.users.fetch(userID, false).then((user) => {
            user.send(`Tezos address https://tzkt.io/${tzAddress}/
Your current balance is: ${balance / 1e6} ꜩ`);
        });

    }

    //change Discord user ID
    if (message.content.startsWith(`${prefix}userid`)) {
        const args = message.content.substring(prefix.length).split(/ +/);
        if (args.length < 2) return message.reply(`${prefix}${args[0]} is not a valid command. Usage: !userid your-discord-user-id`);

        client.users.fetch(args[1], false).then((user) => {
            userID = args[1];
            message.reply(`Discord userID set to: ${userID}`)
        }).catch(err => {
            message.reply(`The userID ${args[1]} is not valid`)
        });
    }

    if (message.content === `${prefix}balance`) {

        const response = await fetch(`https://api.tzkt.io/v1/accounts/${tzAddress}/balance`);
        const balance = await response.json();

        client.users.fetch(userID, false).then((user) => {
            user.send(`Tezos address https://tzkt.io/${tzAddress}/
Your current balance is: ${balance / 1e6} ꜩ`);
        });
    }
})

client.login(config.discord_token);



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

    setInterval(async function () {
        //  if there was no new block, we don't do anything.
        if (isNewBlock()) {
            // the request will be made no more than once a minute.
            const response = await fetch(`https://api.tzkt.io/v1/accounts/${tzAddress}/balance`);
            const currentBalance = await response.json();

            if (lastBalance == null || currentBalance != lastBalance) {

                let addorextract = (currentBalance - lastBalance > 0) ? `⬆️` : `⬇️`;
                let text = `Tezos address https://tzkt.io/${tzAddress}/\n
${addorextract}  Balance changed: ${(currentBalance - lastBalance) / 1e6} ꜩ

Current balance: ${currentBalance / 1e6} ꜩ
Previous balance: ${lastBalance / 1e6} ꜩ
                `;

                if (lastBalance != null) {
                    console.log(text);
                    client.users.fetch(userID, false).then((user) => {
                        user.send(text);
                    });
                }

                lastBalance = currentBalance;

            }
        }
    }, 10000);
}

notifierApp();