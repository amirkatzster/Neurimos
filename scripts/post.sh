#!/bin/bash

set -e

echo 'starting to run post script'
cd ~/www
## ownership
sudo chown -R bitnami:bitnami ../
echo 'ownership changed'

## Set up node
echo 'init'
npm i 
echo 'build ng'
#npm rebuild node-sass --force
/opt/bitnami/nodejs/bin/ng build -prod 2>&1 | tee outfile

echo 'end'

