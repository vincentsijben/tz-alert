# tezos-alert
Simple Node app to send a Discord notification when your Tezos account balance changes.

# Usage
When the Discord bot is added to your server, whenever your Tezos account balance changes (checked every minute due to API limits), you'll receive a DM from your bot.
But you can also send your Bot a DM:
* Get your current Tezos address balance: `!balance`
* Change the Discord User ID (only for testing purposes): `!userid your-user-id`
* Change the Tezos address (only for testing purposes): `!tzaddress your-tezos-address`

# Install
* run `npm install` inside working directory
* create a copy of `config.json.example` and rename it to `config.json`.
* `discord_token`: copy and paste the Discord token (see Discord setup below)
* `discord_userID`: go to a channel and right-click on your name on the right and choose `copy ID`
* `discord_prefix`: pick a prefix that does not exist in your current Discord server
* `tezos_address`: your tezos address you want to get notifications for
* run the program with `node ./src/index.js` 
* keep it running while your account balance changes to see it in action or host it on a live server

# Discord Setup
```
Go to https://discord.com/developers/applications
Click New Application
Give it a name like "Tezos account balance"
Give it a description
Upload an app icon
In the menu section go to Bot to add a Bot user
Click Add Bot
Copy the token and paste it in config.json into the `discord_token` value
Go to the BOT menu and enable both "Privileged Gateway Intents" intents.
In the menu section go to OAuth2 - URL Generator
In the scopes section choose "bot"
In the bot permissions section choose "Send Messages"
---
Copy the URL in the "generated url" section, paste it in your browser, pick the correct server the bot needs to be added to.
```

### Read
* Best practices: https://baking-bad.org/blog/2020/09/28/tezos-explorer-api-tzkt-filter-data-on-the-api/
