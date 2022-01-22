#!/bin/sh
# Tested with DigitalOcean droplet using Ubuntu 20.04 (LTS) x64

# - Create a new droplet in the Digital Ocean interface
# - set up SSH keys
# - connect to your droplet

# install node (quietly), it will run run apt-get update automatically:
curl -sL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt -qq install -y nodejs
# install pm2 globally
sudo npm install -g pm2
sudo apt install -y git
git clone https://github.com/vincentsijben/tz-alert.git /opt/tz-alert/
cd /opt/tz-alert/
# install the project dependencies
npm i
# create the config file
mv config/config.json.example config/config.json
echo
echo "=========================================="
echo "Now edit the config.json!"
echo
echo "You can use: nano config/config.json"
echo "=========================================="
echo
