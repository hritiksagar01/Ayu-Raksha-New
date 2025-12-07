APP_DIR="/var/www/ayu-raksha-frontend"
NGINX_CONF="/etc/nginx/sites-available/ayu-raksha"

sudo tee $NGINX_CONF > /dev/null <<EOL
server {
    listen 80;
    server_name _;

    # Proxy API requests to backend service
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Proxy frontend app (Next.js) to Node server
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/ayu-raksha

sudo nginx -t
sudo systemctl restart nginx
