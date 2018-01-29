#!/usr/bin/env bash
set -e

# update instance
#yum -y update

# install general libraries like Java or ImageMagick
#yum -y install default-jre ImageMagick

# add nodejs to yum
#curl --silent --location https://rpm.nodesource.com/setup_4.x | bash -
#yum -y install nodejs #default-jre ImageMagick

# install pm2 module globaly
/opt/bitnami/nodejs/bin/npm install -g pm2
/opt/bitnami/nodejs/lib/node_modules/pm2/bin/pm2 update
/opt/bitnami/nodejs/lib/node_modules/pm2/bin/pm2 stop neurimos 
/opt/bitnami/nodejs/lib/node_modules/pm2/bin/pm2 delete neurimos