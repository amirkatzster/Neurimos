#!/bin/bash

set +e

echo 'kill all node instances'
NODE_PROCESS=$(ps -ef | grep "node")
if [ -n "$NODE_PROCESS"]; then
   $NODE_PROCESS | awk '{print $2}' | xargs kill -9
fi

