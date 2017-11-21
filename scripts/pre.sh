#!/bin/bash


echo 'kill all node instances'
#kill -9 $(ps aux | grep '\snode\s' | awk '{print $2}')