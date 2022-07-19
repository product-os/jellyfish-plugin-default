# syntax=docker/dockerfile:1

FROM node:16

WORKDIR /usr/src/jellyfish

COPY package.json .npmrc ./
RUN npm install

COPY . ./

CMD /bin/bash -c "echo 1"
