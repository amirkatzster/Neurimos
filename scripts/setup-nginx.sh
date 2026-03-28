#!/usr/bin/env bash
# One-time nginx setup for a new EC2 instance.
# Run as: sudo bash scripts/setup-nginx.sh
#
# Prerequisites:
#   - SSL cert at /home/ec2-user/ssl/neurimos_combined.crt
#   - SSL key at /home/ec2-user/ssl/neurim_com.key
set -e

echo ">>> Installing nginx..."
yum -y install nginx

echo ">>> Writing nginx config..."
bash /home/ec2-user/node/scripts/update-nginx.sh

echo ">>> Enabling and starting nginx..."
systemctl enable nginx
systemctl start nginx

echo ">>> Done. nginx status:"
systemctl status nginx --no-pager
