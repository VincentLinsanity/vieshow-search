# Node LTS
FROM node:argon

# Install libkrb5-dev
RUN apt-get update -qq \
  && apt-get install -y -qq libkrb5-dev

# Create app directory
RUN mkdir -p /usr/src/app/webapp
WORKDIR /usr/src/app/webapp

# Bundle app source
COPY . /usr/src/app/webapp
RUN rm -rf /usr/src/app/webapp/node_modules

# Install app back-end dependencies
RUN cd /usr/src/app/webapp
RUN npm install

# Install gulp & bower
RUN npm install gulp -g

EXPOSE 3000
CMD [ "npm", "start" ]