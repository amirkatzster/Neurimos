#!/bin/bash

set -e

echo 'kill all node instances'
ps -ef | grep "node" | awk '{print $2}' | xargs kill -9