#!/bin/bash
cd /var/www/ayu-raksha-frontend
pm2 delete ayu-raksha-frontend || true
pm2 start npm --name "ayu-raksha-frontend" -- start
pm2 save