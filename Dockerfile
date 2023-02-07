FROM node:16
WORKDIR /opt/app
ADD . .
RUN npm install
RUN npm run build src
CMD ["node", "./dist/main.js"]