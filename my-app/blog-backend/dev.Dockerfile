FROM node:16.20

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]