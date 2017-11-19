#!/bin/bash

set -e

echo 'starting to run post script'
## ownership
whoami
chown root:root /usr/bin/sudo && chmod 4755 /usr/bin/sudo
cd ~/www
sudo chown -R bitnami:bitnami ../
echo 'ownership changed'

## Set up node
echo 'init'
#npm i 
echo 'build ng'
#npm rebuild node-sass --force
#/opt/bitnami/nodejs/bin/ng build -prod 2>&1 | tee outfile

echo 'end'

