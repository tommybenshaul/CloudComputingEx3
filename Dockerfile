FROM node:14

WORKDIR /app

COPY . /app

RUN npm install

RUN exit 1


EXPOSE 8000

CMD [ "npm", "start" ]