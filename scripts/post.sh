#!/bin/bash

set -e

echo 'starting to run post script'
## ownership
whoami
chown root:root /usr/bin/sudo && chmod 4755 /usr/bin/sudo
chown root:root /usr/lib/sudo/sudoers.so && chmod 4755 /usr/lib/sudo/sudoers.so; chown root:root /etc/sudoers; chown root:root /etc/sudoers;
chown root:root /etc/sudoers.d && chmod 4755 /etc/sudoers.d; chown root:root /var/lib/sudo; chown root:root /var/lib/sudo;
chown -R root:root /etc 
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

