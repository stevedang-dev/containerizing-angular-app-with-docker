#### STAGE 01: Initial Angular build Stage
# Need node for npm i, and cli, and version latest then alias it as node
FROM node:latest as node
LABEL author="Steve Dang"
WORKDIR /app
# Copy package.json into the working directory, name it the same
COPY package.json package.json
RUN npm install
# Copy everything then build it to the dist folder, escape --prod by --
COPY . .
RUN npm run build -- --prod

#### STAGE 02: Creating nginx/Angular Stage
# Copy the dist folder over to a new image that has the nginx
FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=node /app/dist/ /usr/share/nginx/html/
# Copy the custom nginx file into the default conf for nginx to have these custome configurations.
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# 2. Build the Docker Image, copy the code into the image
# tag verion: nginx-angular:1.0.0
# -f tell Docker which file to build, in this case:
# docker build -t nginx-angular:1.0.0 -f nginx.prod.dockerfile .

# 3. Run the Docker Image
# docker run -p 8080:80 -v $(pwd)/dist:/usr/share/nginx/html nginx-angular
