#!/usr/bin/env bash
# Writes the nginx config and reloads nginx.
# Called by setup-nginx.sh (first time) and by the deploy workflow (updates).
set -e

tee /etc/nginx/nginx.conf > /dev/null << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;

    # Default catch-all
    server {
        listen       80;
        listen       [::]:80;
        server_name  _;
        root         /usr/share/nginx/html;
        include /etc/nginx/default.d/*.conf;
        error_page 404 /404.html;
        location = /404.html {}
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {}
    }

    # Redirect HTTP -> HTTPS
    server {
        listen 80;
        server_name neurimshoes.co.il www.neurimshoes.co.il;
        return 301 https://$host$request_uri;
    }

    # Main HTTPS server
    server {
        listen 443 ssl;
        http2 on;
        server_name neurimshoes.co.il www.neurimshoes.co.il;

        ssl_certificate     /home/ec2-user/ssl/neurimos_combined.crt;
        ssl_certificate_key /home/ec2-user/ssl/neurim_com.key;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Hashed static assets — cache 1 year
        location ~* \.(js|css|woff|woff2|ttf|eot|ico|png|jpg|jpeg|gif|svg|webp)$ {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            add_header Cache-Control "public, max-age=31536000, immutable" always;
        }

        # HTML / SSR — never cache
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_pass_header Set-Cookie;
            proxy_cache_bypass $http_upgrade;
            add_header Cache-Control "no-cache, no-store, must-revalidate" always;
            add_header Pragma "no-cache" always;
            add_header Expires "0" always;
            add_header Vary "Cookie" always;
        }
    }
}
EOF

nginx -t && systemctl reload nginx
echo ">>> nginx reloaded successfully"
