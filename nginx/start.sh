#!/bin/bash
envsubst '$BACKEND_ADDR,$NGINX_PORT,$NGINX_SERVER_NAME' < /tmp/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'