# <img src="assets/tezos.png" alt="Tezos icon" width="50"> tezos-alert 

A NodeJS application which uses https://api.tzkt.io/ to check for changes in a Tezos account and notify these changes by direct-messaging you on Discord.<br>
<img src="assets/screenshot.png" alt="screenshot from Discord bot message" width="400">

# Usage
When the Discord bot is added to your server, whenever your Tezos account balance changes (checked every minute due to API limits), you'll receive a DM from your bot.
But you can also send your Bot a DM:
* Get your current Tezos address balance: `!balance`
* Change the Discord User ID (only for testing purposes): `!userid your-user-id`
* Change the Tezos address (only for testing purposes): `!tzaddress your-tezos-address`

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

# Local install
* run `npm install` inside working directory
* create a copy of `config.json.example` and rename it to `config.json`.
* `discord_token`: copy and paste the Discord token (see Discord setup below)
* `discord_userID`: copy and paste your Discord User ID (https://techswift.org/2020/04/22/how-to-find-your-user-id-on-discord/)
* `discord_prefix`: pick a prefix that does not exist in your current Discord server. If you don't have any bots, you can use the default "!".
* `tezos_address`: the Tezos address you want to get notifications for
* run the program with `node ./src/index.js` 
* keep it running while your account balance changes to see it in action or host it on a live server



# Digital Ocean droplet
To have your bot 24/7 online, you'll have to put it on an online server. This is an example of using Digital Ocean droplets to quickly deploy your Discord bot online. 

## Manually install:
Check the `install-server.sh` and run the commands one by one. It includes comments so you'll know what each command will do.

## Script install:
Create a new droplet in the Digital Ocean interface, set up SSH keys, connect to your droplet and exit the droplet.
In the next example I assume your droplet IP address will be 128.199.41.186. Run the commands from your local machine inside the repository folder.
```
scp install-server.sh root@128.199.41.186:/opt/
ssh root@128.199.41.186 -t "chmod 771 /opt/install-server.sh && time /opt/install-server.sh && exit; bash --login"
```

## Start the bot
If you've added your Discord token to the `config.json` you can start the bot on the server with:
```
pm2 start /opt/tz-alert/src/index.js --name tz-alert
# start pm2 after reboot
pm2 startup
pm2 save
# to see logs
pm2 logs tz-alert
# check status
pm2 status tz-alert
# to remove
pm2 delete tz-alert
```

If there's an update in the code, make sure it's pushed to the online repository and run this on the server:
```
cd /opt/tz-alert/
git stash
git pull
pm2 delete tz-alert
pm2 start /opt/tz-alert/src/index.js --name tz-alert
pm2 save
```



### Read
* Best practices: https://baking-bad.org/blog/2020/09/28/tezos-explorer-api-tzkt-filter-data-on-the-api/
