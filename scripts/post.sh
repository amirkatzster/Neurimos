#!/bin/bash

set -e

echo 'starting to run post script'
whoami

#global installations
echo 'global installs'
sudo /opt/bitnami/nodejs/bin/npm install -g @angular/cli
sudo /opt/bitnami/nodejs/bin/npm install -g typescript@'>=2.1.0 <2.4.0' 

echo 'ownership change'
cd ~/www
sudo chown -R bitnami:bitnami ../

## Set up node
echo 'init'
/opt/bitnami/nodejs/bin/npm i | tee outfile

echo 'end'


