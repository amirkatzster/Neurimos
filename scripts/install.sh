#!/usr/bin/env bash
set -e

# update instance
yum -y update

# install general libraries like Java or ImageMagick
#yum -y install default-jre ImageMagick

# add nodejs to yum
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
yum -y install nodejs #default-jre ImageMagick
npm install npm@latest -g

set +e
npm install -g concurrently
npm install -g @angular/cli

# install pm2 module globaly
npm install -g pm2
pm2 update