#!/usr/bin/env bash
set -e

cd ~/node
npm install

# setup NODE_ENV
export NODE_ENV=production

hasEnv=`grep "export NODE_ENV" ~/.bash_profile | cat`
if [ -z "$hasEnv" ]; then
    echo "export NODE_ENV=production" >> ~/.bash_profile
else
    sed -i "/export NODE_ENV=\b/c\export NODE_ENV=production" ~/.bash_profile
fi

# add node to startup
hasRc=`grep "su -l $USER" /etc/rc.d/rc.local | cat`
if [ -z "$hasRc" ]; then
    sudo sh -c "echo 'su -l $USER -c \"cd ~/node;sh ./scripts/run.sh\"' >> /etc/rc.d/rc.local"
fi