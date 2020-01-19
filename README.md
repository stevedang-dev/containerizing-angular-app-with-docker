# Angular App & docker

- Containerizing Angular App with docker.

## Dependencies

-

# Modules

## I. Angular and Containers

### 1. [Key Course Concepts](https://github.com/stevedang-dev/containerizing-angular-app-with-docker/pull/1)

- Use nginx, reverse proxy, serve up static content
- Host the image of nginx + Angular (code embedded inside) in a container.

#### Docker commands

- Create an image, put it up in a repo, pull the image down to a machine, server, virtual machine.

```bash
docker pull <image name>
```

- List all the images on the system

```bash
docker images
```

- Remove an image with ID

```bash
docker rmi <image ID>
```

- Build an image

```bash
docker build
```

- Run an image

```bash
docker run <image name>
```

- Show a list of containers to run or stop container:

```bash
docker ps -a
```

- Remove container

```bash
docker rm <container ID>
```

#### Why Docker?

- Deploy an enviroment that an app needs to run the app, we have control over it vs the CDN(Content Delivery Network) server which we don't have any control over the dependencies.

![image](https://user-images.githubusercontent.com/47277517/72653918-46bfbf00-395b-11ea-9bf5-e070b1aded95.png)

#### Benefits of Containers

- Accelerate developer onboarding: use different framework to build an application.
- Eleminate app conflicts: upgrade server framework will break older apps (ie update php versions on the server)
- Environment consistency: same configuation through out the environments. No more surprises.
- Ship software faster: CI/CD and no zero time.

![image](https://user-images.githubusercontent.com/47277517/72654105-fb59e080-395b-11ea-980d-a5ff058cf3cd.png)

#### Run the Angular App in a Container

- Change output path in `angular.json`

```json
"outputPath": "dist",
```

- Run a real web server in the container and link it back to the local source code.
- Create `config/nginx.conf` file.

```conf
server {
    listen 0.0.0.0:80;
    listen [::]:80;
    default_type application/octet-stream;

    gzip                    on;
    gzip_comp_level         6;
    gzip_vary               on;
    gzip_min_length         1000;
    gzip_proxied            any;
    gzip_types              text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_buffers            16 8k;
    client_max_body_size    256M;

    root /usr/share/nginx/html;

    location / {
        try_files $uri $uri/ /index.html =404;
    }
}

```

- Create `nginx.dockerfile`
- `$(pwd)` means current working directory, an alias.

```dockerfile
FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && \
    npm run build

FROM nginx:alpine
LABEL authors="Steve Dang"
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# Use the following commands to build the image and run the container(run from root folder)
# 1. Build the project using
# ng build --prod --watch --delete-output-path false

# 2. Build the Docker Image
# docker build -t nginx-angular -f nginx.dockerfile .

# 3. Run the Docker Image
# docker run -p 8080:80 -v $(pwd)/dist:/usr/share/nginx/html nginx-angular


```

- Run the build command, don't delete the output folder because
- we'll link the container to that `dist` folder using a Docker Volume (an alius inside of the container)
- that will be looking for the /usr/share/nginx/html

```bash
ng build --prod --watch --delete-output-path false
```

- Build a docker image name `nginx-angular`.

```bash
docker build -t nginx-angular -f nginx.dockerfile .
```

- Take this `nginx-angular` image and run it.

```bash
docker run -p 8080:80 -v $(pwd)/dist:/usr/share/nginx/html nginx-angular
```
