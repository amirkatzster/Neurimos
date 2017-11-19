#!/bin/bash
echo 'starting to run post script'

## ownership
chown -R bitnami:bitnami ../
echo 'ownership changed'

## Set up node
npm -i 
#ng build -prod

