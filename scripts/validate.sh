#!/usr/bin/env bash
sleep 10
curl -I 127.0.0.1:3000 | grep "200 OK"