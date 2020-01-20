# Angular App & docker

- Containerizing Angular App with Docker.

## Table of Contents

1. [Angular and Containers](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#i-angular-and-containers)

   - [Key Course Concepts](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#1-key-course-concepts)

		+ [Docker Commands](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#docker-commandse)
		+ [Docker Flags](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#docker-flags)

   - [Why Docker?](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#2-why-docker)
   - [Benefits of Containers](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#benefits-of-containers)
   - [Run Angular App in a Container](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#3-run-the-angular-app-in-a-container)

2. [Creating a Multi-stage Dockerfile](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#ii-creating-a-multi-stage-dockerfile)
   - [Creating the Angular Development Dockerfile](#1-creating-the-angular-development-dockerfile)
   - [Multi-stage Dockerfiles](#2-multi-stage-dockerfiles)
   - [Create the Angular Build Stage](#3-create-the-angular-build-stage-nginx-stage)
   - [Docker Extension](#4-docker-extension)

3. [Deploying the Image and Running the Container](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#iii-deploying-the-image-and-running-the-container)
	- [Running the Angualar Container Locally](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#1-running-the-angualar-container-locally)
	- [Running the Angualar container using the VS Code Docker Extension](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#2-running-the-angualar-container-using-the-vs-code-docker-extension)
	- [Image Registry Options](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#3-image-registry-options)
	- [Deploying the Angualar Runtime Image to a Registry](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#4-deploying-the-angualar-runtime-image-to-a-registry)
	- [Running the Angualar container in Azure](https://github.com/stevedang-dev/containerizing-angular-app-with-docker#5-running-the-angualar-container-in-azure)

4. [Running Multiple Containers]()
	- [Running the Application with Docker Compose]()
	- [Exploring the Docker Compose File]()
	- [Options for Deploying Multiple Image/Containers]()

## Modules

## I. [Angular and Containers](https://github.com/stevedang-dev/containerizing-angular-app-with-docker/pull/1)

### 1. Key Course Concepts

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

- Remove unused containers on the system, free up some space

```bash
docker system prune
```

- Find and remove docker image:

```bash
docker images
docker rmi <Image ID - first 3 letters>
```

- If there's an error,

```
Error response from daemon: conflict: unable to delete cfc715a87d1f (cannot be forced) - image is being used by running container 0667146a63c1
```

- Run **docker ps -a** to show all the running containers,
- Stop the container **docker stop 066**
- Remove it **docker rm 066**

```
CONTAINER ID	IMAGE		COMMAND
0667146a63c1	nginx-angular 	"nginx -g 'daemon of…"
CREATED		STATUS		PORTS               	NAMES
3 hours ago	Up 3 hours	0.0.0.0:8080->80/tcp 	mystifying_chaum
```

- Build docker containers with docker compose

``` bash
docker-compose -f docker-compose.prod.yml build
```

- Run all the containers, stop all

```bash
docker-compose up
docker-compose down
```

#### Docker flags

- Run a specific docker file: `-f <file-name>`
- Add version to the image name: `nginx-angular:<version-number>`
- Normal docker command:

```bash
docker build -t nginx-angular .
```

- Added some flags:

```bash
docker build -t nginx-angular:1.0.0 -f nginx.prod.dockerfile .
```

- Detach mode: **-d**
```
docker run -d -p 8080:80 nginx-angular
```

### 2. Why Docker

- Deploy an enviroment that an app needs to run the app, we have control over it vs the CDN(Content Delivery Network) server which we don't have any control over the dependencies.

![image](https://user-images.githubusercontent.com/47277517/72653918-46bfbf00-395b-11ea-9bf5-e070b1aded95.png)

#### Benefits of Containers

- **Accelerate developer onboarding**: use different framework to build an application.
- **Eleminate app conflicts**: upgrade server framework will break older apps (ie update php versions on the server)
- **Environment consistency**: same configuation through out the environments. No more surprises.
- **Ship software faster**: CI/CD and no zero time.

![image](https://user-images.githubusercontent.com/47277517/72654105-fb59e080-395b-11ea-980d-a5ff058cf3cd.png)

### 3. Run the Angular App in a Container

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

![image](https://user-images.githubusercontent.com/47277517/72672576-0d09b980-3a2a-11ea-8634-4721ae68628e.png)


---

## II. [Creating a Multi-stage Dockerfile](https://github.com/stevedang-dev/containerizing-angular-app-with-docker/pull/2)

### 1. Creating the Angular Development Dockerfile

- Copy the custom nginx file `./config/nginx.conf` into the default conf for nginx to have these custome configurations.

```
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
```

- Live development instead for rebuild and recreate the image everytime: `-v`
- Similar to `ng serve` but it has the same behavior as the server, to test the app when it's closed to deployment.

```dockerfile
docker run -p 8080:80 -v $(pwd)/dist:/usr/share/nginx/html nginx-angular
```

- If it find an uri(uniform resource identifier), redirect it back to the index.html, ie. when the route is bookmark, run through index.html Angular code fisrt.

```conf

location / {
	try_files $uri $uri/ /index.html =404;
}
```

### 2. Multi-stage Dockerfiles

- Normal Dockerfile:

![image](https://user-images.githubusercontent.com/47277517/72673490-439b0080-3a39-11ea-8a7f-68d9647f941c.png)

- We can do BETTER! More efficient

Multiple stages that docker goes through:

- **Stage 1**: build the app in the container, CI/CD => Itermediate Image,
- **Stage 2**: Copy code (dist folder) and create server => Final Image.

### 3. Create the Angular Build Stage, Nginx Stage

- Stage 01: Angular Build Stage.

```dockerfile
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
```

- Stage 02: Nginx Stage

```dockerfile
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

```

- Find and remove docker image:

```bash
docker images
docker rmi <Image ID - first 3 letters>
```

- If there's an error,

```
Error response from daemon: conflict: unable to delete cfc715a87d1f (cannot be forced) - image is being used by running container 0667146a63c1
```

- Run **docker ps -a** to show all the running containers,
- Stop the container **docker stop 066**
- Remove it **docker rm 066**

```
CONTAINER ID	IMAGE		COMMAND
0667146a63c1	nginx-angular 	"nginx -g 'daemon of…"
CREATED		STATUS		PORTS               	NAMES
3 hours ago	Up 3 hours	0.0.0.0:8080->80/tcp 	mystifying_chaum
```

### 4. Docker Extension

![image](https://user-images.githubusercontent.com/47277517/72675617-f88ee680-3a54-11ea-980a-1c4b7a81329f.png)
![image](https://user-images.githubusercontent.com/47277517/72675656-72bf6b00-3a55-11ea-91f1-faf4cb10325f.png)

![image](https://user-images.githubusercontent.com/47277517/72675662-a7cbbd80-3a55-11ea-998b-de850f48bd68.png)
![image](https://user-images.githubusercontent.com/47277517/72675674-f11c0d00-3a55-11ea-9acb-46ea17ab528f.png)


---


## III. [Deploying the Image and Running the Container](https://github.com/stevedang-dev/containerizing-angular-app-with-docker/pull/3)

### 1. Running the Angualar Container Locally

- Build the docker image:

```bash
docker build -t nginx-angular -f nginx.prod.dockerfile .
```

- Detach mode: **-d**
``` bash
docker run -d -p 8080:80 nginx-angular
```

### 2. Running the Angualar container using the VS Code Docker Extension

- Build the docker image:

![image](https://user-images.githubusercontent.com/47277517/72683245-a9bc6d80-3aa3-11ea-9d97-3ef74e2d4561.png)

- Detach mode: **-d**

![image](https://user-images.githubusercontent.com/47277517/72685226-1ccedf80-3ab6-11ea-87e7-72bde5c33e35.png)

### 3. Image Registry Options

- Container Registry stores Docker Images similar to GitHub,
so different env (QA, STG, PROD) could pull them down and run.

![image](https://user-images.githubusercontent.com/47277517/72687151-27df3b00-3ac9-11ea-9d46-cc118916b37a.png)

- Only a layer get updated, then Container Registry will keep track of the changes.
	+ Create images (middle)
	+ Registry is like a shelf system that can track the changes of the images on the shelf.
	+ Server has access to the registry can pull the container down and run it. **Consistency between the environments.**


![image](https://user-images.githubusercontent.com/47277517/72687224-c1a6e800-3ac9-11ea-95da-918b52ee2741.png)

#### Container Registries
- Docker Images can be stored in the cloud or onsite using container registries.

- Options:
	+ Docker Hub
	+ Azure Container Registry
	+ Amazon EC2 Container Registry
	+ Private Registry
	+ Google Cloud

### 4. Deploying the Angualar Runtime Image to a Registry

- Tag image by the **registry** name

![image](https://user-images.githubusercontent.com/47277517/72687486-3da22f80-3acc-11ea-9c00-47045265e936.png)
![image](https://user-images.githubusercontent.com/47277517/72695195-b07bcc80-3b05-11ea-9ae6-4b9c8eefa433.png)

- Run the image:

![image](https://user-images.githubusercontent.com/47277517/72695236-d43f1280-3b05-11ea-8dbe-68fe9afda12a.png)

- Push the image to the registry

![image](https://user-images.githubusercontent.com/47277517/72695348-2da74180-3b06-11ea-8345-0631db0933c1.png)

- Then the image will be available on Docker Hub

![image](https://user-images.githubusercontent.com/47277517/72695389-53344b00-3b06-11ea-84c4-24d44cd01398.png)

- It can be pulled from anywhere

``` bash
docker pull stevedang/nginx-angular:1.0.0
```

### 5. Running the Angualar container in Azure

![image](https://user-images.githubusercontent.com/47277517/72695815-ef128680-3b07-11ea-86ae-9fd294b70d9b.png)

- Select Docker Hub

![image](https://user-images.githubusercontent.com/47277517/72695906-46185b80-3b08-11ea-8429-3e757e224027.png)


- Then Azure can pull the image down and run the image through its own server

- DEMO: https://pizza-lover.azurewebsites.net

![image](https://user-images.githubusercontent.com/47277517/72696348-d1462100-3b09-11ea-836f-69490efb035a.png)


---

## IV. [Running Multiple Containers](https://github.com/stevedang-dev/containerizing-angular-app-with-docker/pull/4)

### 1. Running the Application with Docker Compose
- There are two containers need to bring up (Angular and Nodejs containers) in a way that they can talk to each other.

```
- Step 1: Rebuild project.
- Step 2: Build both server and fontend app: **docker-compose build**, this will build the containers for server and frontend.
- Step 3: Bring containers up and run them: **docker-compose up**, (use cadvisor to monitor the existing containers)
- Step 4: Stop all the containers: **docker-compose down**.
```

- Node dockerfile

``` dockerfile
FROM node:alpine

LABEL author="Steve Dang"

WORKDIR /var/www/angular-node-service

COPY package.json package.json
RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]

```

- **docker-compose up**

![image](https://user-images.githubusercontent.com/47277517/72747661-49046200-3b83-11ea-803d-de8d636b8c1e.png)

- cAdvisor Docker Containers: http://localhost:8080/containers/

![image](https://user-images.githubusercontent.com/47277517/72747795-a0a2cd80-3b83-11ea-8927-6b826a889928.png)
![image](https://user-images.githubusercontent.com/47277517/72747875-ce881200-3b83-11ea-88aa-07a6f2f3d0ac.png)
![image](https://user-images.githubusercontent.com/47277517/72747959-0f802680-3b84-11ea-85a4-381ef422eff4.png)

- **docker-compose down**

![image](https://user-images.githubusercontent.com/47277517/72748030-3b9ba780-3b84-11ea-915e-c46cbb5a468c.png)

### 2. Exploring the Docker Compose File

- Docker Compose Yml file

``` yml
# Run docker-compose build
# Run docker-compose up
# Live long and prosper

version: "3.1"

# There are 3 services here: nginx, node, and cadvisor
services:

  # Fontend Angular
  nginx:
    container_name: nginx-angular
	# Image name
	image: nginx-angular
	# Where to find the docker file to build
	build:
	  # Location in root
      context: .
      dockerfile: nginx.dockerfile
	# Link the /usr/share/nginx/html back to dist folder
	volumes:
      - ./dist:/usr/share/nginx/html
    ports:
      - "80:80"
      - "443:443"
    depends_on:
	  - node
	# Use the same group to talk to each other
    networks:
	  - app-network

  # Backend Node
  node:
    container_name: angular-node-service
    image: angular-node-service
    build:
      context: ./server
      dockerfile: node.dockerfile
    environment:
      - NODE_ENV=development
    ports:
      - "3000:3000"
    networks:
	  - app-network

  # Bridge to monitor the containers
  cadvisor:
    container_name: cadvisor
    image: google/cadvisor
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - "8080:8080"
    networks:
	  - app-network

networks:
  app-network:
    driver: bridge

```

### 3. Options for Deploying Multiple Image/Containers

![image](https://user-images.githubusercontent.com/47277517/72748839-53742b00-3b86-11ea-923e-cbd4071d5cdf.png)

- [**KUBERNETES**](https://kubernetes.io/):
	- Manage and orchestrate many containers.
	- Scale them out.
	- Replace containers as updates come out.
	- Self-headling

![image](https://user-images.githubusercontent.com/47277517/72748803-40615b00-3b86-11ea-8cb5-fe306d8e5ca3.png)

