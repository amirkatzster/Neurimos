#!/bin/bash

set -e


echo 'build ng'
#/opt/bitnami/nodejs/bin/ng build -prod 2>&1 | tee outfile
/opt/bitnami/nodejs/bin/npm run prod > /dev/null 2> /dev/null < /dev/null & # 2>&1 | tee -a outfile