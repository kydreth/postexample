# docker build -t centos/web web
FROM node:14 AS web-dev
WORKDIR /opt/postexample/web
RUN yarn global add @angular/cli@9.0.5
RUN ng config -g cli.packageManager yarn
COPY package.json angular.json ./
RUN yarn install
ENV PATH="./node_modules/.bin:$PATH"
COPY . ./
RUN ng build --prod --configuration=production --output-path=dist
#ng serve --host=0.0.0.0 --disableHostCheck --verbose=false --open=true --port=4200
ENTRYPOINT ["ng","serve", "--host=0.0.0.0", "--disableHostCheck", "--no-live-reload"]
#ENTRYPOINT ["ng","e2e"]
