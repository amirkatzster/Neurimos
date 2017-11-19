#!/bin/bash
echo 'starting to run post script'
cd ~/www
## ownership
sudo chown -R bitnami:bitnami ../
echo 'ownership changed'

## Set up node
npm i 
ng build -aot -prod


