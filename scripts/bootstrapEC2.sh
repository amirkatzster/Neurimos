#!/usr/bin/env bash

sudo yum update
sudo yum -y install ruby  
sudo yum -y install wget
cd /home/ec2-user

wget https://aws-codedeploy-eu-central-1.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

sudo service codedeploy-agent status


## DONT FORGET TO COPY THE CONFIG FILES