#!/usr/bin/env bash
set -e

# update instance
yum -y update

# install general libraries like Java or ImageMagick
#yum -y install default-jre ImageMagick
yum -y install gcc-c++
yum -y install nmap-ncat

# add nodejs to yum
# curl --silent --location https://rpm.nodesource.com/setup_9.x | bash -
# yum -y install nodejs #default-jre ImageMagick
set +e
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
#npm install npm@latest -g

npm install -g concurrently
npm install -g @angular/cli
npm install -g typescript 

# install pm2 module globaly
npm install -g pm2
pm2 update

#permissions
chmod +x /etc/rc.d/rc.local