#!/usr/bin/env bash

sudo yum update
sudo yum -y install ruby  
sudo yum -y install wget
cd /home/ec2-user

wget https://aws-codedeploy-eu-central-1.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

sudo service codedeploy-agent status

# add nodejs to yum
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20
npm install -g pm2


sudo dnf install -y nftables
sudo nft add table ip nat
sudo nft add chain ip nat prerouting { type nat hook prerouting priority 0 \; }
sudo nft add rule ip nat prerouting tcp dport 80 redirect to :3000
sudo nft add rule ip nat prerouting tcp dport 443 redirect to :4000

#old...
# sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
# sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 4000

## DONT FORGET TO COPY THE CONFIG FILES