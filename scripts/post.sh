#!/bin/bash

set -e

echo 'starting to run post script'
whoami

#global installations
echo 'global installs'
npm install -g @angular/cli
npm install -g typescript@'>=2.1.0 <2.4.0' 

echo 'ownership change'
cd ~/www
sudo chown -R bitnami:bitnami ../


## Set up node
echo 'init'
npm i | tee outfile

echo 'build ng'
#/opt/bitnami/nodejs/bin/ng build -prod 2>&1 | tee outfile
npm run prod 2>&1 | tee -a outfile

echo 'end'

