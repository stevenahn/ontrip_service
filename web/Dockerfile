# FROM mhart/alpine-node:14
FROM node:lts

WORKDIR /app
COPY ./web .
RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]