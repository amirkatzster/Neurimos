#!/usr/bin/env bash
# Bootstrap script for Amazon Linux 2023 EC2 instance
# Run as ec2-user

# ── System update ────────────────────────────────────────────
sudo dnf update -y
sudo dnf install -y git wget

# ── Node.js via nvm ──────────────────────────────────────────
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

nvm install 20
nvm use 20
nvm alias default 20

# ── PM2 ──────────────────────────────────────────────────────
npm install -g pm2
pm2 startup   # run the printed command to enable auto-restart on reboot
# pm2 save    # run after first app start

# ── Nginx ────────────────────────────────────────────────────
sudo dnf install -y nginx
sudo systemctl enable nginx

# Create Nginx config (fill in domain + cert paths)
sudo tee /etc/nginx/conf.d/neurimos.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name neurimshoes.co.il www.neurimshoes.co.il;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name neurimshoes.co.il www.neurimshoes.co.il;

    ssl_certificate     /home/ec2-user/ssl/neurimos_combined.crt;
    ssl_certificate_key /home/ec2-user/ssl/private_decrypted.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo nginx -t
sudo systemctl start nginx

# ── Clone app ────────────────────────────────────────────────
mkdir -p /home/ec2-user/node
cd /home/ec2-user/node
git clone https://github.com/amirkatzster/Neurimos .

npm ci --legacy-peer-deps
npm run prod

pm2 start ecosystem.config.js --env production
pm2 save

# ── SSL certificate setup ────────────────────────────────────
# 1. Upload GoDaddy files to /home/ec2-user/ssl/
#    scp your_domain.crt      ec2-user@HOST:/home/ec2-user/ssl/
#    scp gd_bundle-g2-g1.crt  ec2-user@HOST:/home/ec2-user/ssl/
#    scp private_key.pem      ec2-user@HOST:/home/ec2-user/ssl/
#
# 2. Combine cert + bundle
#    cat your_domain.crt gd_bundle-g2-g1.crt > /home/ec2-user/ssl/neurimos_combined.crt
#
# 3. Decrypt private key (removes passphrase for Nginx)
#    openssl pkey -in private_key.pem -out /home/ec2-user/ssl/private_decrypted.key
#
# 4. Reload Nginx
#    sudo nginx -t && sudo systemctl reload nginx

# ── .env ─────────────────────────────────────────────────────
# Copy manually from local machine — never commit to git:
#   scp .env ec2-user@HOST:/home/ec2-user/node/.env

# ── EC2 Security Group (AWS Console) ─────────────────────────
# Inbound rules required:
#   HTTP  port 80   0.0.0.0/0
#   HTTPS port 443  0.0.0.0/0
#   SSH   port 22   0.0.0.0/0  (restrict to your IP in production)
