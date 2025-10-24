#!/bin/bash
# ==============================
# start_server.sh - for CodeDeploy + Nginx
# ==============================

set -e  # Exit on any error

# Go to the app directory
cd /var/www/ayu-raksha-frontend

# --- Ensure Node.js 20 is installed using nvm ---
if [ ! -d "$HOME/.nvm" ]; then
  echo "Installing NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
  source ~/.bashrc
fi

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Install Node.js 20 if not already installed
if ! nvm ls 20 &>/dev/null; then
  echo "Installing Node.js 20..."
  nvm install 20
fi

nvm use 20
nvm alias default 20

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# --- Install dependencies ---
npm install

# --- Start app using PM2 ---
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

pm2 delete ayu-raksha-frontend || true
pm2 start npm --name "ayu-raksha-frontend" -- start
pm2 save

# --- Install Nginx if not installed ---
if ! command -v nginx &>/dev/null; then
  echo "Installing Nginx..."
  sudo apt update
  sudo apt install -y nginx
fi

# --- Configure Nginx reverse proxy ---
NGINX_CONF="/etc/nginx/sites-available/ayu-raksha-frontend"
sudo bash -c "cat > $NGINX_CONF" <<EOL
server {
    listen 80;
    server_name _;

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

# Enable the site and restart Nginx
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "Deployment finished successfully! Nginx is serving the app on port 80."
