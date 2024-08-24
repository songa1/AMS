FROM node:alpine

WORKDIR /usr/app

RUN npm install --global pm2

COPY ./* ./*
COPY ./package*.json ./
COPY ./public ./public

RUN npm install

RUN npm run build

RUN chown -R node /usr/app/.next/cache
RUN chmod -R 744 /usr/app/.next/cache

EXPOSE 3000

USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]