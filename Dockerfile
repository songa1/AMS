FROM node:alpine

WORKDIR /usr/app

RUN npm install --global --legacy-peer-deps pm2
RUN npm run build --legacy-peer-deps

COPY . .

RUN chown -R node /usr/app/.next/cache
RUN chmod -R 744 /usr/app/.next/cache

EXPOSE 3000

USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]