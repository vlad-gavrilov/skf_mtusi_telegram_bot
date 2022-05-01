FROM node:18-alpine3.14

ENV TZ Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app
COPY . .
RUN npm update -g npm && npm install --production

CMD [ "npm", "start" ]