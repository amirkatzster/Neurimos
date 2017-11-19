#!/bin/bash
pwd
ls
cd ~\www
pwd
ls

whoami


echo 'starting to run post script'

## ownership
sudo chown -R bitnami:bitnami ../
echo 'ownership changed'

## Set up node
sudo npm -i 
#ng build -prod

