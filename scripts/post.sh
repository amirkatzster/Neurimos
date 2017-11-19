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
/opt/bitnami/nodejs/bin/ng build -aot -prod

echo 'end'

