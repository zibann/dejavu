FROM node:10.13.0-alpine
MAINTAINER appbase.io <info@appbase.io>

RUN addgroup -S -g 201 dejavu && \
    adduser -S -u 201 -G dejavu dejavu

WORKDIR /dejavu

RUN apk --no-cache update \
    && apk --no-cache add git \
    && rm -rf /var/cache/apk/*


ADD package.json yarn.lock /dejavu/


RUN yarn \
    && yarn cache clean && yarn build:dejavu:app \
    && rm -rf /dejavu/node_modules \
    && rm -rf /tmp/*


ADD . /dejavu

RUN chown -R dejavu:dejavu /dejavu

USER dejavu

EXPOSE 1358

CMD node packages/dejavu-main/server.js
