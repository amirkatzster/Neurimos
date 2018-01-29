#!/bin/bash

set +e

echo 'kill pm2 instances'
/opt/bitnami/nodejs/lib/node_modules/pm2/bin/pm2 stop neurimos && /opt/bitnami/nodejs/lib/node_modules/pm2/bin/pm2 delete neurimos


#NODE_PROCESS=$(ps -ef | grep "node")
#echo NODE_PROCESS
#if [ -n "$NODE_PROCESS" ]; then
#    $NODE_PROCESS | awk '{print $2}' | xargs kill -9
#fi

