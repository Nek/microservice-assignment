FROM node:6.10.3-alpine

COPY package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
COPY ./package.json /opt/app/package.json
COPY ./api /opt/app/api
COPY ./config /opt/app/config
COPY app.js /opt/app/app.js

CMD ["npm", "start"]