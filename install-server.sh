#!/bin/sh
# for digitalocean droplet using Ubuntu 20.04 (LTS) x64

# install node, it will run run apt-get update automatically:
curl -sL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt -qq install -y nodejs
# install pm2 globally
sudo npm install -g pm2
# sudo apt install -y git-all
sudo apt install -y git
git clone https://github.com/vincentsijben/tz-alert.git /opt/tz-alert/
cd /opt/tz-alert/
# install the project dependencies
npm i
# create the config file
mv config/config.json.example config/config.json
echo
echo "Now put your own token in the config.json!"
echo
