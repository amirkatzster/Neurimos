#!/bin/bash
pwd
ll
whome


echo 'starting to run post script'

## ownership
sudo chown -R bitnami:bitnami ../
echo 'ownership changed'

## Set up node
sudo npm -i 
#ng build -prod

